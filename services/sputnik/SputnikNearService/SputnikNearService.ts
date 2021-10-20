/* eslint-disable @typescript-eslint/no-explicit-any */
import Big from 'big.js';
import PromisePool from '@supercharge/promise-pool';
import { Contract, keyStores, Near } from 'near-api-js';

import { NearConfig, nearConfig } from 'config';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import { CreateDaoInput } from 'types/dao';
import { CreateTokenParams } from 'types/token';
import { CreateProposalParams } from 'types/proposal';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { CookieService } from 'services/CookieService';
import { SputnikDaoService } from 'services/SputnikService/SputnikDaoService';
import { SputnikWalletService } from 'services/SputnikService/SputnikWalletService';

class SputnikNearServiceClass {
  private readonly config: NearConfig;

  private sputnikWalletService!: SputnikWalletService;

  private sputnikDaoService!: SputnikDaoService;

  private factoryTokenContract!: Contract & any;

  private near!: Near;

  constructor(config: NearConfig) {
    this.config = config;
  }

  public init(): void {
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    this.near = new Near({
      ...this.config,
      keyStore
    });

    this.sputnikWalletService = new SputnikWalletService(this.near);
    this.sputnikWalletService.init();

    const account = this.sputnikWalletService.getAccount();

    this.sputnikDaoService = new SputnikDaoService(
      this.config.contractName,
      this.sputnikWalletService
    );

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
  }

  public isAuthorized(): boolean {
    if (process.browser && this.sputnikWalletService) {
      return !!this.sputnikWalletService.getAccountId();
    }

    return !!CookieService.get(ACCOUNT_COOKIE);
  }

  public async login(): Promise<void> {
    await this.sputnikWalletService.login();
  }

  public async logout(): Promise<void> {
    this.sputnikWalletService.logout();
  }

  public getAccountId(): string {
    if (!process.browser) {
      return CookieService.get(ACCOUNT_COOKIE);
    }

    if (!this.sputnikWalletService && process.browser) {
      this.init();
    }

    return this.sputnikWalletService.getAccountId();
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

    await this.factoryTokenContract.create_token(
      { args },
      BoatOfGas.toFixed(0)
    );
  }

  public async createDao(params: CreateDaoInput): Promise<boolean> {
    try {
      await this.sputnikDaoService.create(params);

      showNotification({
        type: NOTIFICATION_TYPES.INFO,
        description: `The blockchain transactions might take some time to perform, please visit DAO details page in few seconds`,
        lifetime: 20000
      });

      return true;
    } catch (err) {
      console.error(err);
    }

    return false;
  }

  public async createProposal(params: CreateProposalParams): Promise<any> {
    return this.sputnikDaoService.addProposal(params).then(() => {
      showNotification({
        type: NOTIFICATION_TYPES.INFO,
        description: `The blockchain transactions might take some time to perform, please visit DAO details page in few seconds`,
        lifetime: 20000
      });
    });
  }

  public async claimBounty(
    daoId: string,
    args: { bountyId: number; deadline: string; bountyBond: string }
  ) {
    await this.sputnikDaoService.claimBounty({ daoId, ...args });

    showNotification({
      type: NOTIFICATION_TYPES.INFO,
      description: `The blockchain transactions might take some time to perform, please refresh the page in few seconds`,
      lifetime: 20000
    });
  }

  public async unclaimBounty(daoId: string, bountyId: string) {
    await this.sputnikDaoService.unclaimBounty(daoId, bountyId);

    showNotification({
      type: NOTIFICATION_TYPES.INFO,
      description: `The blockchain transactions might take some time to perform, please refresh the page in few seconds`,
      lifetime: 20000
    });
  }

  public async finalize(contractId: string, proposalId: number): Promise<void> {
    return this.sputnikDaoService.finalize(contractId, proposalId);
  }

  public async vote(
    daoId: string,
    proposalId: number,
    action: 'VoteApprove' | 'VoteRemove' | 'VoteReject'
  ): Promise<void> {
    return this.sputnikDaoService.vote(daoId, proposalId, action).then(() => {
      showNotification({
        type: NOTIFICATION_TYPES.INFO,
        description: `The blockchain transactions might take some time to perform, please refresh the page in few seconds.`,
        lifetime: 20000
      });
    });
  }

  public async nearAccountExist(accountId: string): Promise<boolean> {
    const account = await this.near.account(accountId);

    try {
      await account.state();

      return true;
    } catch (e) {
      return false;
    }
  }
}

export const SputnikNearService = new SputnikNearServiceClass(nearConfig);
