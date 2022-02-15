import BN from 'bn.js';
import Big from 'big.js';
import compact from 'lodash/compact';
import PromisePool from '@supercharge/promise-pool';
import { AccessKey } from 'near-api-js/lib/transaction';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores';
import { utils, transactions, Contract, keyStores, Near } from 'near-api-js';

import { NearConfig, nearConfig } from 'config';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import { CreateDaoInput } from 'types/dao';
import { CreateTokenParams, SputnikTokenService } from 'types/token';
import { Transfer, VoteAction, CreateProposalParams } from 'types/proposal';

import { CookieService } from 'services/CookieService';

import { configService } from 'services/ConfigService';
import { GAS_VALUE, SputnikDaoService } from './services/SputnikDaoService';
import { SputnikWalletService } from './services/SputnikWalletService';

import { SputnikConnectedWalletAccount } from './overrides/SputnikConnectedWalletAccount';

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

  public init(walletUseLocalRedirect: boolean): void {
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
      this.sputnikWalletService,
      walletUseLocalRedirect ?? false
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
      const appConfig = configService.get();

      if (appConfig) {
        this.init(appConfig.LOCAL_WALLET_REDIRECT);
      }
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

    if (!bigSource) {
      return undefined;
    }

    return Big(bigSource);
  }

  // for testing purpose
  public async listTokens(): Promise<void> {
    const tokensCount = await this.factoryTokenContract.get_number_of_tokens?.();

    if (typeof tokensCount === 'undefined') {
      return;
    }

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
    args: {
      bountyId: number;
      deadline: string;
      bountyBond: string;
      gas?: string | number;
    }
  ) {
    return this.sputnikDaoService.claimBounty({ daoId, ...args });
  }

  public async unclaimBounty(
    daoId: string,
    bountyId: number,
    gas?: string | number
  ) {
    return this.sputnikDaoService.unclaimBounty(daoId, bountyId, gas);
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
    action: VoteAction,
    gas?: string | number
  ): Promise<FinalExecutionOutcome> {
    return this.sputnikDaoService.vote(daoId, proposalId, action, gas);
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

  private async buildTransaction(
    contractId: string,
    nonce: number,
    actions: transactions.Action[],
    blockHash: Uint8Array
  ) {
    const accountId = this.getAccountId();

    const keyPair = await this.keyStore?.getKey(
      this.config.networkId,
      this.getAccountId()
    );

    const publicKey = keyPair?.getPublicKey();

    if (!publicKey) {
      return null;
    }

    const transaction = transactions.createTransaction(
      accountId,
      publicKey,
      contractId,
      nonce,
      actions,
      blockHash
    );

    return transaction;
  }

  private getTransferStorageDepositTransaction(
    nonce: number,
    blockHash: Uint8Array,
    tokenContract: string,
    recipient: string
  ) {
    return this.buildTransaction(
      tokenContract,
      nonce,
      [
        transactions.functionCall(
          'storage_deposit',
          {
            account_id: recipient,
            registration_only: true,
          },
          GAS_VALUE,
          // 0.1 NEAR, minimal value
          new BN('100000000000000000000000')
        ),
      ],
      blockHash
    );
  }

  private getCreateTransferProposalTransaction(
    nonce: number,
    blockHash: Uint8Array,
    proposal: CreateProposalParams
  ) {
    const { bond, daoId, description, kind, data } = proposal;

    return this.buildTransaction(
      daoId,
      nonce,
      [
        transactions.functionCall(
          'add_proposal',
          {
            proposal: {
              description,
              kind: {
                [kind]: data,
              },
            },
          },
          GAS_VALUE,
          new BN(bond)
        ),
      ],
      blockHash
    );
  }

  public async createTokenTransferProposal(
    proposal: CreateProposalParams | null
  ) {
    if (!proposal) {
      return Promise.resolve();
    }

    const { bond, daoId, description, kind, data } = proposal;

    const {
      token_id: tokenContract,
      receiver_id: recipient,
    } = data as Transfer;

    const storageDepositTransactionAction = {
      contract: tokenContract,
      action: transactions.functionCall(
        'storage_deposit',
        {
          account_id: recipient,
          registration_only: true,
        },
        GAS_VALUE,
        // 0.1 NEAR, minimal value
        new BN('100000000000000000000000')
      ),
    };

    const transferTransaction = {
      contract: daoId,
      action: transactions.functionCall(
        'add_proposal',
        {
          proposal: {
            description,
            kind: {
              [kind]: data,
            },
          },
        },
        GAS_VALUE,
        new BN(bond)
      ),
    };

    const trx = tokenContract
      ? [storageDepositTransactionAction, transferTransaction]
      : [transferTransaction];

    return this.sendTransactions(trx);
  }

  public async sendTransactions(
    transactionsConf: { contract: string; action: transactions.Action }[]
  ) {
    const accountId = this.getAccountId();
    const publicKey = await this.getPublicKey();

    const accessKey = ((await this.near.connection.provider.query(
      `access_key/${accountId}/${publicKey}`,
      ''
    )) as unknown) as AccessKey;

    if (!accessKey) {
      throw new Error(`Cannot find matching key for transaction`);
    }

    const block = await this.near.connection.provider.block({
      finality: 'final',
    });
    const blockHash = utils.serialize.base_decode(block.header.hash);

    const account = (this.sputnikWalletService.getAccount() as unknown) as SputnikConnectedWalletAccount;

    const trx = await Promise.all(
      transactionsConf.map(({ contract, action }, i) =>
        this.buildTransaction(
          contract,
          accessKey.nonce + i + 1,
          [action],
          blockHash
        )
      )
    );

    return account.sendTransactions(compact(trx));
  }
}

export const SputnikNearService = new SputnikNearServiceClass(nearConfig);
