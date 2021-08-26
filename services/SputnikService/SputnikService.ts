/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect, Contract, keyStores, Near } from 'near-api-js';
import { NearConfig, nearConfig } from 'config';
import Decimal from 'decimal.js';
import { CreateDaoParams, DaoItem } from 'types/dao';
import { timestampToReadable } from 'utils/timestampToReadable';
import {
  CreateProposalParams,
  Proposal,
  ProposalRaw,
  ProposalType
} from 'types/proposal';
import { HttpService, httpService } from 'services/HttpService';
import { ContractPool } from './ContractPool';
import { yoktoNear, gas } from './constants';
import { mapProposalRawToProposal } from './utils';
import { SputnikWalletConnection } from './SputnikWalletConnection';

class SputnikService {
  private readonly config: NearConfig;

  private readonly httpService: HttpService = httpService;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private factoryContract!: Contract & any;

  private walletConnection!: SputnikWalletConnection;

  private near!: Near;

  private contractPool!: ContractPool;

  constructor(config: NearConfig) {
    this.config = config;
  }

  public async init(): Promise<void> {
    this.near = await connect({
      deps: {
        keyStore: new keyStores.BrowserLocalStorageKeyStore()
      },
      ...this.config
    });

    this.walletConnection = new SputnikWalletConnection(this.near, 'sputnik');

    const account = this.walletConnection.account();

    this.factoryContract = new Contract(account, this.config.contractName, {
      viewMethods: ['get_dao_list'],
      changeMethods: ['create']
    });

    this.contractPool = new ContractPool(account);
  }

  public isAuthorized(): boolean {
    if (process.browser && this.walletConnection) {
      return this.walletConnection.isSignedIn();
    }

    return true;
  }

  public async login(): Promise<void> {
    await this.walletConnection.requestSignIn(
      this.config.contractName,
      'Sputnik DAO',
      `${window.origin}/callback`,
      `${window.origin}/callback`
    );
    await this.init();
  }

  public async logout(): Promise<void> {
    this.walletConnection.signOut();
  }

  public getAccountId(): string {
    return this.walletConnection.getAccountId();
  }

  public async createDao(params: CreateDaoParams): Promise<any> {
    const argsList = {
      purpose: params.purpose,
      council: params.council.split('\n').filter(item => item),
      bond: new Decimal(params.bond).mul(yoktoNear).toFixed(),
      vote_period: new Decimal(params.votePeriod).mul('3.6e12').toFixed(),
      grace_period: new Decimal(params.gracePeriod).mul('3.6e12').toFixed()
    };

    const amount = new Decimal(params.amountToTransfer);
    const amountYokto = amount.mul(yoktoNear).toFixed();
    const args = Buffer.from(JSON.stringify(argsList)).toString('base64');

    try {
      await this.factoryContract.create(
        {
          name: params.name,
          args
        },
        gas,
        amountYokto.toString()
      );
    } catch (err) {
      if (err.message !== 'Failed to redirect to sign transaction') {
        throw err;
      }
    }
  }

  public async createProposal(params: CreateProposalParams): Promise<any> {
    const data: any = {
      target: params.target,
      description: params.description,
      kind: {
        type: params.kind.type
      }
    };

    if (params.link) {
      data.description = `${params.description} ---${params.link}`.trim();
    }

    if (params.kind.type === ProposalType.Payout) {
      const amount = new Decimal(params.kind.amount);
      const amountYokto = amount.mul(yoktoNear).toFixed();

      data.kind.amount = amountYokto;
    }

    if (params.kind.type === ProposalType.ChangeVotePeriod) {
      const votePeriod = new Decimal(params.kind.votePeriod).mul('3.6e12');

      data.kind.vote_period = votePeriod;
    }

    if (params.kind.type === ProposalType.ChangePurpose) {
      data.kind.purpose = params.kind.purpose;
    }

    return this.contractPool.get(params.daoId).add_proposal(
      {
        proposal: data
      },
      new Decimal('30000000000000').toString(),
      params.bond
    );
  }

  public async getDaoList(offset = 0, limit = 50): Promise<DaoItem[]> {
    const { data: daos } = await this.httpService.get<DaoItem[]>('/daos', {
      params: {
        offset,
        limit
      }
    });

    return daos.map(dao => ({
      ...dao,
      votePeriod: timestampToReadable(parseInt(dao.votePeriod, 10))
    }));
  }

  public async getDaoById(daoId: string): Promise<DaoItem | null> {
    try {
      const { data: dao } = await this.httpService.get<DaoItem>(
        `/daos/${daoId}`
      );

      return dao;
    } catch (error) {
      if ([400, 404].includes(error.response.status)) {
        return null;
      }

      throw error;
    }
  }

  public async getProposals(
    daoId: string,
    offset = 0,
    limit = 50
  ): Promise<Proposal[]> {
    const { data: proposals } = await this.httpService.get<ProposalRaw[]>(
      '/proposals',
      {
        params: { daoId, offset, limit }
      }
    );

    return proposals.map(mapProposalRawToProposal);
  }

  public async getProposal(
    contractId: string,
    index: number
  ): Promise<Proposal | null> {
    try {
      const { data: proposal } = await this.httpService.get<ProposalRaw>(
        `/proposals/${contractId}-${index}`
      );

      return mapProposalRawToProposal(proposal);
    } catch (error) {
      if ([400, 404].includes(error.response.status)) {
        return null;
      }

      throw error;
    }
  }

  public addProposal(contractId: string): Promise<void> {
    return this.contractPool.get(contractId).add_proposal;
  }

  public vote(
    contractId: string,
    proposalId: number,
    vote: 'Yes' | 'No'
  ): Promise<void> {
    return this.contractPool.get(contractId).vote({
      id: proposalId,
      vote
    });
  }

  public finalize(contractId: string, proposalId: number): Promise<void> {
    return this.contractPool.get(contractId).finalize({
      id: proposalId
    });
  }
}

const nearService = new SputnikService(nearConfig);

export default nearService;
