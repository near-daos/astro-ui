import {
  ConnectedWalletAccount,
  InMemorySigner,
  keyStores,
  Near,
  providers,
  transactions,
  utils,
} from 'near-api-js';
import { SputnikWalletConnection } from 'services/sputnik/SputnikNearService/overrides/SputnikWalletConnection';
import {
  BrowserLocalStorageKeyStore,
  KeyStore,
} from 'near-api-js/lib/key_stores';
import {
  AccessKey,
  Action,
  functionCall,
  transfer,
} from 'near-api-js/lib/transaction';
import { SputnikConnectedWalletAccount } from 'services/sputnik/SputnikNearService/overrides/SputnikConnectedWalletAccount';
import compact from 'lodash/compact';
import { WalletType } from 'types/config';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { FunctionCallOptions } from 'near-api-js/lib/account';
import { getSignature } from 'services/sputnik/SputnikNearService/walletServices/helpers';
import {
  Transaction,
  WalletMeta,
  WalletService,
} from 'services/sputnik/SputnikNearService/walletServices/types';
import BN from 'bn.js';
import { NearConfig } from 'config/near';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import {
  AccessKeyInfoView,
  AccountView,
  FunctionCallPermissionView,
} from 'near-api-js/lib/providers/provider';
import { httpService } from 'services/HttpService';

import { RpcService } from 'services/sputnik/SputnikNearService/walletServices/RpcService';
import { PkAndSignature } from 'context/WalletContext/types';
import { configService } from 'services/ConfigService';

import { NEAR_WALLET_METADATA } from './constants';

export class SputnikWalletService implements WalletService {
  private readonly near: Near;

  private readonly walletType = WalletType.NEAR;

  private walletConnection!: SputnikWalletConnection;

  private readonly config: NearConfig;

  private keyStore: BrowserLocalStorageKeyStore;

  public readonly successUrl: string = `${window.origin}/callback/auth`;

  public readonly failureUrl: string = `${window.origin}/callback/auth`;

  private accessKeys: AccessKeyInfoView[] = [];

  private rpcService: RpcService;

  constructor(nearConfig: NearConfig) {
    const keyStore = new keyStores.BrowserLocalStorageKeyStore(
      window.localStorage
    );

    this.config = nearConfig;

    this.keyStore = keyStore;
    this.near = new Near({
      ...nearConfig,
      keyStore,
    });

    this.walletConnection = new SputnikWalletConnection(this.near, 'sputnik');

    this.rpcService = new RpcService(
      new providers.JsonRpcProvider(nearConfig.nodeUrl)
    );
  }

  async getPkAndSignatureFromLocalKeyStore(): Promise<PkAndSignature | null> {
    const accountId = await this.getAccountId();

    const { nearConfig } = configService.get();

    const keyPair = await this.keyStore.getKey(nearConfig.networkId, accountId);

    const publicKey = keyPair.getPublicKey();

    if (!publicKey) {
      return null;
    }

    return {
      publicKey: publicKey.toString(),
      signature: await getSignature(keyPair),
    };
  }

  getPkAndSignature(): Promise<PkAndSignature | null> {
    return this.getPkAndSignatureFromLocalKeyStore();
  }

  viewAccount(accountId: string): Promise<AccountView> {
    return this.rpcService.viewAccount(accountId);
  }

  contractCall<T>(
    accountId: string,
    methodName: string,
    argsAsBase64: string
  ): Promise<T> {
    return this.rpcService.contractCall<T>(accountId, methodName, argsAsBase64);
  }

  getKeyStore(): KeyStore {
    return this.keyStore;
  }

  // eslint-disable-next-line class-methods-use-this
  walletMeta(): WalletMeta {
    return NEAR_WALLET_METADATA;
  }

  async getAvailableAccounts(): Promise<string[]> {
    return this.keyStore.getAccounts(this.config.networkId);
  }

  async isSignedIn(): Promise<boolean> {
    const accountId = await this.getAccountId();

    return !!this.walletConnection && accountId !== '';
  }

  async functionCall(
    props: FunctionCallOptions
  ): Promise<FinalExecutionOutcome[]> {
    const directCallsList = ['act_proposal'];
    const accountId = await this.getAccountId();
    const { accessKeys } = this;

    const accessKeyForDao = accessKeys
      .filter(accessKey => accessKey.access_key.permission !== 'FullAccess')
      .find(accessKey => {
        const functionCallPermission = accessKey.access_key
          .permission as FunctionCallPermissionView;

        return (
          functionCallPermission.FunctionCall.receiver_id === props.contractId
        );
      });

    if (directCallsList.includes(props.methodName) && accessKeyForDao) {
      const transaction = await this.buildTransaction(
        props.contractId,
        accessKeyForDao.access_key.nonce + 1,
        [
          functionCall(
            props.methodName,
            props.args,
            props.gas ?? new BN(0),
            new BN(0)
          ),
        ]
      );

      const signer = new InMemorySigner(this.keyStore);

      const [, signedTransaction] = await transactions.signTransaction(
        transaction,
        signer,
        accountId,
        this.walletConnection.account().connection.networkId
      );

      try {
        const result = await this.near.connection.provider.sendTransaction(
          signedTransaction
        );

        const transactionHashes = result.transaction.hash;
        const signerId = result.transaction.signer_id;

        await httpService.get(
          `/transactions/wallet/callback/${signerId}?transactionHashes=${transactionHashes}&noRedirect=true`
        );

        return [result];
      } catch (e) {
        console.error(e);
      }
    }

    const result = await this.getAccount().functionCall({
      ...props,
      walletCallbackUrl: `${window.origin}/api/server/v1/transactions/wallet/callback/${accountId}`,
    });

    return [result];
  }

  public async signIn(contractId: string): Promise<boolean> {
    await this.walletConnection.sputnikRequestSignIn(
      contractId,
      this.successUrl,
      this.failureUrl
    );

    const keys = await this.getAccount().getAccessKeys();

    if (keys) {
      this.accessKeys = keys;
    }

    return Promise.resolve(true);
  }

  public logout(): Promise<void> {
    return Promise.resolve(this.walletConnection.signOut());
  }

  public getAccount(): ConnectedWalletAccount {
    return this.walletConnection.account();
  }

  public getAccountId(): Promise<string> {
    const accountId = this.walletConnection.getAccountId();

    return Promise.resolve(accountId);
  }

  public async getPublicKey(): Promise<string | null> {
    const accountId = await this.getAccountId();

    const keyPair = this.config
      ? await this.keyStore?.getKey(this.config.networkId, accountId)
      : null;

    const publicKey = keyPair?.getPublicKey();

    if (!publicKey) {
      return null;
    }

    return publicKey.toString();
  }

  async getSignature(): Promise<string | null> {
    try {
      const accountId = await this.getAccountId();

      const keyPair = this.config
        ? await this.keyStore?.getKey(this.config.networkId, accountId)
        : null;

      if (!keyPair) {
        // eslint-disable-next-line no-console
        console.log('Failed to get keyPair');

        return null;
      }

      return getSignature(keyPair);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Failed to generate signature', err);

      return null;
    }
  }

  public async sendTransactions(
    transactionsConf: Transaction[]
  ): Promise<FinalExecutionOutcome[]> {
    const accountId = await this.getAccountId();
    const publicKey = await this.getPublicKey();

    const accessKey = (await this.near.connection.provider.query(
      `access_key/${accountId}/${publicKey}`,
      ''
    )) as unknown as AccessKey;

    if (!accessKey) {
      throw new Error(`Cannot find matching key for transaction`);
    }

    const account =
      this.getAccount() as unknown as SputnikConnectedWalletAccount;

    const trx = await Promise.all(
      transactionsConf.map(({ receiverId, actions }, i) =>
        this.buildTransaction(
          receiverId,
          accessKey.nonce + i + 1,
          actions.map(action => action as unknown as Action)
        )
      )
    );

    return account.sendTransactions(compact(trx));
  }

  private async buildTransaction(
    contractId: string,
    nonce: number,
    actions: transactions.Action[]
  ) {
    const accountId = await this.getAccountId();
    const block = await this.near.connection.provider.block({
      finality: 'final',
    });
    const blockHash = utils.serialize.base_decode(block.header.hash);

    const keyPair = await this.keyStore.getKey(
      this.config.networkId,
      accountId
    );

    const publicKey = keyPair.getPublicKey();

    return transactions.createTransaction(
      accountId,
      publicKey,
      contractId,
      nonce,
      actions,
      blockHash
    );
  }

  getWalletType(): WalletType {
    return this.walletType;
  }

  async sendMoney(
    receiverId: string,
    amount: number
  ): Promise<FinalExecutionOutcome[]> {
    const parsedNear = parseNearAmount(amount.toString());

    const nearAsBn = new BN(parsedNear ?? 0);

    return this.sendTransactions([
      { receiverId, actions: [transfer(nearAsBn)] },
    ]);
  }
}
