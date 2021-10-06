/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import PromisePool from '@supercharge/promise-pool';
import Big from 'big.js';
import { NearConfig, nearConfig } from 'config';
import Decimal from 'decimal.js';
import omit from 'lodash/omit';
import { Contract, keyStores, Near } from 'near-api-js';

import { HttpService, httpService } from 'services/HttpService';
import {
  DaoDTO,
  fromMetadataToBase64,
  GetDAOsResponse,
  mapDaoDTOListToDaoList,
  mapDaoDTOtoDao
} from 'services/SputnikService/mappers/dao';
import {
  GetProposalsResponse,
  mapProposalDTOToProposal,
  ProposalDTO
} from 'services/SputnikService/mappers/proposal';
import { mapTokensDTOToTokens } from 'services/SputnikService/mappers/token';
import {
  mapSearchResultsDTOToDataObject,
  SearchResponse
} from 'services/SputnikService/mappers/search-results';
import {
  GetTransactionsResponse,
  mapTransactionDTOToTransaction
} from 'services/SputnikService/mappers/transaction';
import { BountiesResponse, BountyResponse } from 'types/bounties';

import { PaginationResponse } from 'types/api';
import { CreateDaoInput, DAO } from 'types/dao';
import { CreateProposalParams, Proposal, ProposalType } from 'types/proposal';
import { SearchResultsData } from 'types/search';

import {
  CreateTokenParams,
  GetTokensResponse,
  TokenType,
  NftToken
} from 'types/token';
import { Transaction } from 'types/transaction';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { gas, yoktoNear } from './constants';
import { ContractPool } from './ContractPool';
import { SputnikWalletConnection } from './SputnikWalletConnection';

class SputnikService {
  private readonly config: NearConfig;

  private readonly httpService: HttpService = httpService;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private factoryContract!: Contract & any;

  private factoryTokenContract!: Contract & any;

  private walletConnection!: SputnikWalletConnection;

  private near!: Near;

  private contractPool!: ContractPool;

  constructor(config: NearConfig) {
    this.config = config;
  }

  public init(): void {
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    this.near = new Near({
      ...this.config,
      keyStore
    });

    this.walletConnection = new SputnikWalletConnection(this.near, 'sputnik');

    const account = this.walletConnection.account();

    this.factoryContract = new Contract(account, this.config.contractName, {
      viewMethods: ['get_dao_list'],
      changeMethods: ['create']
    });

    this.factoryTokenContract = new Contract(
      account,
      this.config.tokenContractName,
      {
        viewMethods: [
          'get_required_deposit',
          'get_number_of_tokens',
          'get_tokens',
          'get_token'
        ],
        changeMethods: ['create_token', 'storage_deposit']
      }
    );

    this.contractPool = new ContractPool(account);
  }

  public claimBounty(
    daoId: string,
    args: { bountyId: number; deadline: string; bountyBond: string }
  ) {
    const { bountyId: id, deadline, bountyBond } = args;

    this.contractPool
      .get(daoId)
      .bounty_claim(
        {
          id,
          deadline
        },
        gas,
        bountyBond
      )
      .then(() => {
        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: `The blockchain transactions might take some time to perform, please refresh the page in few seconds`,
          lifetime: 20000
        });
      });
  }

  public unclaimBounty(daoId: string, bountyId: string) {
    this.contractPool
      .get(daoId)
      .bounty_giveup({ id: bountyId }, gas)
      .then(() => {
        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: `The blockchain transactions might take some time to perform, please refresh the page in few seconds`,
          lifetime: 20000
        });
      });
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
    return this.walletConnection?.getAccountId();
  }

  async computeRequiredDeposit(args: unknown) {
    return Big(
      await this.factoryTokenContract.get_required_deposit({
        args,
        account_id: this.getAccountId()
      })
    );
  }

  // for testing purpose
  public async listTokens() {
    const tokensCount = await this.factoryTokenContract.get_number_of_tokens();
    const chunkSize = 5;
    const chunkCount =
      (tokensCount - (tokensCount % chunkSize)) / chunkSize + 1;

    const { results, errors } = await PromisePool.withConcurrency(1)
      .for([...Array(chunkCount).keys()])
      .process(async (offset: number) =>
        this.factoryTokenContract.get_tokens({
          from_index: offset * chunkSize,
          limit: chunkSize
        })
      );

    // eslint-disable-next-line no-console
    console.log(results, errors);
  }

  public async createToken(params: CreateTokenParams): Promise<any> {
    const args = {
      owner_id: this.getAccountId(),
      total_supply: '1000000000000000000000',
      metadata: {
        spec: 'ft-1.0.0',
        decimals: 18,
        name: params.name,
        symbol: params.symbol,
        icon: params.icon
      }
    };

    const TGas = Big(10).pow(12);
    const BoatOfGas = Big(200).mul(TGas);
    // const requiredDeposit = await this.computeRequiredDeposit(args);
    //
    // await this.factoryTokenContract.storage_deposit(
    //   {},
    //   BoatOfGas.toFixed(0),
    //   requiredDeposit.toFixed(0)
    // );

    await this.factoryTokenContract.create_token(
      { args },
      BoatOfGas.toFixed(0)
    );
  }

  public async createDao(params: CreateDaoInput): Promise<boolean> {
    const argsList = {
      purpose: params.purpose,
      bond: new Decimal(params.bond).mul(yoktoNear).toFixed(),
      vote_period: new Decimal(params.votePeriod).mul('3.6e12').toFixed(),
      grace_period: new Decimal(params.gracePeriod).mul('3.6e12').toFixed(),
      policy: {
        roles: params.policy.roles,
        default_vote_policy: params.policy.defaultVotePolicy,
        proposal_bond: new Decimal(params.policy.proposalBond)
          .mul(yoktoNear)
          .toFixed(),
        proposal_period: new Decimal(params.policy.proposalPeriod)
          .mul('3.6e12')
          .toFixed(),
        bounty_bond: new Decimal(params.policy.bountyBond)
          .mul(yoktoNear)
          .toFixed(),
        bounty_forgiveness_period: new Decimal(
          params.policy.bountyForgivenessPeriod
        )
          .mul('3.6e12')
          .toFixed()
      },
      config: {
        name: params.name,
        purpose: params.purpose,
        metadata: fromMetadataToBase64({
          links: params.links,
          flag: params.flag,
          displayName: params.displayName
        })
      }
    };

    const amount = new Decimal(params.amountToTransfer);
    const amountYokto = amount.mul(yoktoNear).toFixed();
    const args = Buffer.from(JSON.stringify(argsList)).toString('base64');

    try {
      const result = await this.factoryContract.create(
        {
          name: params.name,
          args
        },
        gas,
        amountYokto.toString()
      );

      showNotification({
        type: NOTIFICATION_TYPES.INFO,
        description: `The blockchain transactions might take some time to perform, please visit DAO details page in few seconds`,
        lifetime: 20000
      });

      return result;
    } catch (err) {
      if (err.message !== 'Failed to redirect to sign transaction') {
        throw err;
      }
    }

    return false;
  }

  public async createProposal(params: CreateProposalParams): Promise<any> {
    const { daoId, description, kind, data, bond } = params;

    const kindData = data
      ? {
          [kind]: data
        }
      : kind;

    return this.contractPool
      .get(daoId)
      .add_proposal(
        {
          proposal: {
            description,
            kind: kindData
          }
        },
        new Decimal('30000000000000').toString(),
        bond
      )
      .then(() => {
        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: `The blockchain transactions might take some time to perform, please visit DAO details page in few seconds`,
          lifetime: 20000
        });
      });
  }

  public async getDaoList(params?: {
    offset?: number;
    limit?: number;
    sort?: string;
    filter?: string;
    createdBy?: string;
  }): Promise<DAO[]> {
    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? 500;
    const sort = params?.sort ?? 'createdAt,DESC';

    const { data } = await this.httpService.get<GetDAOsResponse>('/daos', {
      params: {
        filter: params?.filter,
        offset,
        limit,
        sort,
        createdBy: params?.createdBy
      }
    });

    return mapDaoDTOListToDaoList(data.data);
  }

  public async getDaoById(daoId: string): Promise<DAO | null> {
    try {
      const { data: dao } = await this.httpService.get<DaoDTO>(
        `/daos/${daoId}`
      );

      return mapDaoDTOtoDao(dao);
    } catch (error) {
      if ([400, 404].includes(error.response.status)) {
        return null;
      }

      throw error;
    }
  }

  public async search(params: {
    offset?: number;
    limit?: number;
    sort?: string;
    query: string;
  }): Promise<SearchResultsData | null> {
    // const offset = params?.offset ?? 0;
    // const limit = params?.limit ?? 50;

    const result = await this.httpService.get<SearchResponse>('/search', {
      params: {
        query: params.query
      }
    });

    return mapSearchResultsDTOToDataObject(params.query, {
      daos: (result.data as SearchResponse).daos as DaoDTO[],
      proposals: (result.data as SearchResponse).proposals as ProposalDTO[],
      members: []
    });
  }

  public async getAccountDaos(accountId: string): Promise<DAO[]> {
    const { data } = await this.httpService.get<DaoDTO[]>(
      `/daos/account-daos/${accountId}`
    );

    return mapDaoDTOListToDaoList(data);
  }

  public async getBountiesDone(daoId: string): Promise<Proposal[]> {
    const queryString = RequestQueryBuilder.create()
      .setFilter({
        field: 'daoId',
        operator: '$eq',
        value: daoId
      })
      .setFilter({
        field: 'kind',
        operator: '$cont',
        value: ProposalType.BountyDone
      })
      .setFilter({
        field: 'status',
        operator: '$eq',
        value: 'Approved'
      })
      .setLimit(500)
      .setOffset(0)
      .sortBy({
        field: 'createdAt',
        order: 'DESC'
      })
      .query();

    const { data: bounties } = await this.httpService.get<GetProposalsResponse>(
      `/proposals?${queryString}`
    );

    return bounties.data.map(mapProposalDTOToProposal);
  }

  public async getActiveProposals(
    daoIds: string[],
    offset = 0,
    limit = 50
  ): Promise<Proposal[]> {
    const queryString = RequestQueryBuilder.create()
      .setFilter({
        field: 'daoId',
        operator: '$in',
        value: daoIds
      })
      .setFilter({
        field: 'status',
        operator: '$eq',
        value: 'InProgress'
      })
      .setLimit(limit)
      .setOffset(offset)
      .sortBy({
        field: 'createdAt',
        order: 'DESC'
      })
      .query();

    const { data: proposals } = await this.httpService.get<
      GetProposalsResponse
    >(`/proposals?${queryString}`);

    return proposals.data.map(mapProposalDTOToProposal);
  }

  public async getUserProposals(accountId: string) {
    const queryString = RequestQueryBuilder.create()
      .setFilter({
        field: 'proposer',
        operator: '$eq',
        value: accountId
      })
      .setLimit(500)
      .setOffset(0)
      .query();

    const response = await this.httpService.get<GetProposalsResponse>(
      `/proposals?${queryString}`
    );

    return response.data.data;
  }

  public async getFilteredProposals(
    filter: {
      daoViewFilter: string | null;
      daoFilter: 'All DAOs' | 'My DAOs' | 'Following DAOs';
      proposalFilter:
        | 'Active proposals'
        | 'Recent proposals'
        | 'My proposals'
        | null;
    },
    accountId: string
  ): Promise<Proposal[]> {
    const queryString = RequestQueryBuilder.create();

    if (filter.daoViewFilter) {
      queryString.setFilter({
        field: 'daoId',
        operator: '$eq',
        value: filter.daoViewFilter
      });
    } else if (filter.daoFilter === 'My DAOs') {
      const accountDaos = await this.getAccountDaos(accountId);

      queryString.setFilter({
        field: 'daoId',
        operator: '$in',
        value: accountDaos.map(item => item.id)
      });
    }

    if (filter.proposalFilter === 'Active proposals') {
      queryString.setFilter({
        field: 'status',
        operator: '$eq',
        value: 'InProgress'
      });
    } else if (filter.proposalFilter === 'My proposals') {
      queryString.setFilter({
        field: 'proposer',
        operator: '$eq',
        value: accountId
      });
    } else if (filter.proposalFilter === 'Recent proposals') {
      queryString.setFilter({
        field: 'status',
        operator: '$in',
        value: ['Approved', 'Rejected', 'Expired', 'Moved']
      });
    }

    queryString
      .setLimit(1000)
      .setOffset(0)
      .sortBy({
        field: 'createdAt',
        order: 'DESC'
      })
      .query();

    const { data: proposals } = await this.httpService.get<
      GetProposalsResponse
    >(`/proposals?${queryString.queryString}`);

    return proposals.data.map(mapProposalDTOToProposal);
  }

  public async getProposals(
    daoId?: string,
    offset = 0,
    limit = 50
  ): Promise<Proposal[]> {
    const params = {
      filter: `daoId||$eq||${daoId}`,
      offset,
      limit
    };

    const { data: proposals } = await this.httpService.get<
      GetProposalsResponse
    >('/proposals', {
      params: daoId ? params : omit(params, 'filter')
    });

    return proposals.data.map(mapProposalDTOToProposal);
  }

  public async getTransfers(daoId?: string): Promise<Transaction[]> {
    const queryString = RequestQueryBuilder.create()
      .setFilter({
        field: 'transactionAction.actionKind',
        operator: '$in',
        value: ['TRANSFER', 'FUNCTION_CALL']
      })
      .setFilter({
        field: 'receiverAccountId',
        operator: '$eq',
        value: daoId
      })
      .setOr({
        field: 'receipts.predecessorAccountId',
        operator: '$eq',
        value: daoId
      })
      .setLimit(500)
      .setOffset(0)
      .sortBy({
        field: 'blockTimestamp',
        order: 'DESC'
      })
      .query();

    const { data: transfers } = await this.httpService.get<
      GetTransactionsResponse
    >(`/transactions?${queryString}`);

    return mapTransactionDTOToTransaction(daoId as string, transfers.data);
  }

  public async getPolls(
    daoId: string,
    offset = 0,
    limit = 50
  ): Promise<Proposal[]> {
    const { data: proposals } = await this.httpService.get<
      GetProposalsResponse
    >('/proposals', {
      params: {
        filter: `daoId||$eq||${daoId}`,
        offset,
        limit
      }
    });

    return proposals.data
      .filter(item => item.kind.type === 'Vote')
      .map(mapProposalDTOToProposal);
  }

  public async getProposal(
    contractId: string,
    index: number
  ): Promise<Proposal | null> {
    try {
      const { data: proposal } = await this.httpService.get<ProposalDTO>(
        `/proposals/${contractId}-${index}`
      );

      return mapProposalDTOToProposal(proposal);
    } catch (error) {
      if ([400, 404].includes(error.response.status)) {
        return null;
      }

      throw error;
    }
  }

  public async getBountiesByDaoId(
    daoId: string,
    params?: {
      offset?: number;
      limit?: number;
      sort?: string;
    }
  ): Promise<BountyResponse[]> {
    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? 50;
    const sort = params?.sort ?? 'createdAt,DESC';

    const { data } = await this.httpService.get<BountiesResponse>('/bounties', {
      params: {
        filter: `daoId||$eq||${daoId}`,
        offset,
        limit,
        sort
      }
    });

    return data.data;
  }

  public async getNfts(
    ownerId: string,
    offset = 0,
    limit = 50
  ): Promise<NftToken[]> {
    const { data } = await this.httpService.get<PaginationResponse<NftToken>>(
      '/tokens/nfts',
      {
        params: { offset, limit, filter: `ownerId||$eq||${ownerId}` }
      }
    );

    return data.data;
  }

  public vote(
    daoId: string,
    proposalId: number,
    action: 'VoteApprove' | 'VoteRemove' | 'VoteReject'
  ): Promise<void> {
    return this.contractPool
      .get(daoId)
      .act_proposal({
        id: proposalId,
        action
      })
      .then(() => {
        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: `The blockchain transactions might take some time to perform, please refresh the page in few seconds.`,
          lifetime: 20000
        });
      });
  }

  public async getTokens(params: {
    dao: string;
    offset?: number;
    limit?: number;
    sort?: string;
  }): Promise<TokenType[]> {
    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? 50;
    const sort = params?.sort ?? 'createdAt,DESC';

    const { data } = await this.httpService.get<GetTokensResponse>('/tokens', {
      params: {
        filter: `ownerId||$eq||${params.dao}`,
        offset,
        limit,
        sort
      }
    });

    return mapTokensDTOToTokens(data.data);
  }

  public finalize(contractId: string, proposalId: number): Promise<void> {
    return this.contractPool.get(contractId).finalize({
      id: proposalId
    });
  }
}

const nearService = new SputnikService(nearConfig);

export default nearService;
