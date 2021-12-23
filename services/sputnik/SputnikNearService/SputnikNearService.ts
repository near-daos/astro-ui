import Big from 'big.js';
import PromisePool from '@supercharge/promise-pool';
import { Contract, keyStores, Near } from 'near-api-js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores';

import { NearConfig, nearConfig } from 'config';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import { CreateDaoInput } from 'types/dao';
import { CreateProposalParams, VoteAction } from 'types/proposal';
import { CreateTokenParams, SputnikTokenService } from 'types/token';

import { CookieService } from 'services/CookieService';

import { SputnikDaoService } from './services/SputnikDaoService';
import { SputnikWalletService } from './services/SputnikWalletService';

class SputnikNearServiceClass {
  private readonly config: NearConfig;

  private sputnikWalletService!: SputnikWalletService;

  private sputnikDaoService!: SputnikDaoService;

  private factoryTokenContract!: SputnikTokenService;

  private near!: Near;

  private keyStore?: BrowserLocalStorageKeyStore;

  constructor(config: NearConfig) {
    this.config = config;
  }

  public init(): void {
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    this.keyStore = keyStore;
    this.near = new Near({
      ...this.config,
      keyStore,
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
          'get_token',
        ],
        changeMethods: ['create_token', 'storage_deposit'],
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

  public async getPublicKey(): Promise<string | null> {
    const keyPair = await this.keyStore?.getKey(
      this.config.networkId,
      this.getAccountId()
    );

    const publicKey = keyPair?.getPublicKey();

    if (!publicKey) {
      return null;
    }

    return publicKey.toString();
  }

  async getSignature(): Promise<string | null> {
    try {
      const keyPair = await this.keyStore?.getKey(
        this.config.networkId,
        this.getAccountId()
      );

      if (!keyPair) {
        // eslint-disable-next-line no-console
        console.log('Failed to get keyPair');

        return null;
      }

      const publicKey = keyPair.getPublicKey();
      const msg = Buffer.from(publicKey.toString());

      const { signature } = keyPair.sign(msg);
      const signatureBase64 = Buffer.from(signature).toString('base64');

      const isValid = keyPair.verify(msg, signature);

      if (!isValid) {
        // eslint-disable-next-line no-console
        console.log('Failed to create valid signature');

        return null;
      }

      return signatureBase64;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Failed to generate signature', err);

      return null;
    }
  }

  async computeRequiredDeposit(args: unknown) {
    const bigSource = await this.factoryTokenContract.get_required_deposit?.({
      args,
      account_id: this.getAccountId(),
    });

    if (!bigSource) return undefined;

    return Big(bigSource);
  }

  // for testing purpose
  public async listTokens(): Promise<void> {
    const tokensCount = await this.factoryTokenContract.get_number_of_tokens?.();

    if (typeof tokensCount === 'undefined') return;

    const chunkSize = 5;
    const chunkCount =
      (tokensCount - (tokensCount % chunkSize)) / chunkSize + 1;

    const { results, errors } = await PromisePool.withConcurrency(1)
      .for([...Array(chunkCount).keys()])
      .process(async (offset: number) =>
        this.factoryTokenContract.get_tokens?.({
          from_index: offset * chunkSize,
          limit: chunkSize,
        })
      );

    // eslint-disable-next-line no-console
    console.log(results, errors);
  }

  public async createToken(params: CreateTokenParams): Promise<void> {
    const args = {
      owner_id: this.getAccountId(),
      total_supply: '1000000000000000000000',
      metadata: {
        spec: 'ft-1.0.0',
        decimals: 18,
        name: params.name,
        symbol: params.symbol,
        icon: params.icon,
      },
    };

    const TGas = Big(10).pow(12);
    const BoatOfGas = Big(200).mul(TGas);

    await this.factoryTokenContract.create_token?.(
      { args },
      BoatOfGas.toFixed(0)
    );
  }

  public async createDao(params: CreateDaoInput): Promise<void> {
    await this.sputnikDaoService.create(params);
  }

  public async createProposal(
    params: CreateProposalParams
  ): Promise<FinalExecutionOutcome> {
    return this.sputnikDaoService.addProposal(params);
  }

  public async registerUserToToken(tokenId: string, recipient: string) {
    return this.sputnikDaoService.registerToToken(tokenId, recipient);
  }

  public async claimBounty(
    daoId: string,
    args: { bountyId: number; deadline: string; bountyBond: string }
  ) {
    await this.sputnikDaoService.claimBounty({ daoId, ...args });
  }

  public async unclaimBounty(daoId: string, bountyId: string) {
    await this.sputnikDaoService.unclaimBounty(daoId, bountyId);
  }

  public async finalize(
    contractId: string,
    proposalId: number
  ): Promise<FinalExecutionOutcome> {
    return this.sputnikDaoService.finalize(contractId, proposalId);
  }

  public async vote(
    daoId: string,
    proposalId: number,
    action: VoteAction
  ): Promise<FinalExecutionOutcome> {
    return this.sputnikDaoService.vote(daoId, proposalId, action);
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
