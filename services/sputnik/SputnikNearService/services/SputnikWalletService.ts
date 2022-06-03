import {
  ConnectedWalletAccount,
  InMemorySigner,
  keyStores,
  Near,
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
import { getSignature } from 'services/sputnik/SputnikNearService/services/helpers';
import {
  Transaction,
  WalletMeta,
  WalletService,
} from 'services/sputnik/SputnikNearService/services/types';
import BN from 'bn.js';
import { NearConfig } from 'config/near';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import {
  AccessKeyInfoView,
  FunctionCallPermissionView,
} from 'near-api-js/lib/providers/provider';
import { httpService } from 'services/HttpService';

export class SputnikWalletService implements WalletService {
  private readonly near: Near;

  private readonly walletType = WalletType.NEAR;

  private walletConnection!: SputnikWalletConnection;

  private readonly config: NearConfig;

  private keyStore: BrowserLocalStorageKeyStore;

  private walletInfo: WalletMeta = {
    name: 'NEAR',
    type: 'web',
    url: 'wallet.near.org',
    id: WalletType.NEAR,
  };

  public readonly successUrl: string = `${window.origin}/callback/auth`;

  public readonly failureUrl: string = `${window.origin}/callback/auth`;

  private accessKeys: AccessKeyInfoView[] = [];

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
  }

  getKeyStore(): KeyStore {
    return this.keyStore;
  }

  walletMeta(): WalletMeta {
    return this.walletInfo;
  }

  async getAvailableAccounts(): Promise<string[]> {
    return this.keyStore.getAccounts(this.config.networkId);
  }

  isSignedIn(): boolean {
    return !!this.walletConnection && this.getAccountId() !== '';
  }

  async functionCall(
    props: FunctionCallOptions
  ): Promise<FinalExecutionOutcome[]> {
    const directCallsList = ['act_proposal'];
    const accountId = this.getAccountId();
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

  public logout(): void {
    this.walletConnection.signOut();
  }

  public getAccount(): ConnectedWalletAccount {
    return this.walletConnection.account();
  }

  public getAccountId(): string {
    return this.walletConnection.getAccountId();
  }

  public async getPublicKey(): Promise<string | null> {
    const keyPair = this.config
      ? await this.keyStore?.getKey(this.config.networkId, this.getAccountId())
      : null;

    const publicKey = keyPair?.getPublicKey();

    if (!publicKey) {
      return null;
    }

    return publicKey.toString();
  }

  async getSignature(): Promise<string | null> {
    try {
      const keyPair = this.config
        ? await this.keyStore?.getKey(
            this.config.networkId,
            this.getAccountId()
          )
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
    const accountId = this.getAccountId();
    const publicKey = await this.getPublicKey();

    const accessKey = ((await this.near.connection.provider.query(
      `access_key/${accountId}/${publicKey}`,
      ''
    )) as unknown) as AccessKey;

    if (!accessKey) {
      throw new Error(`Cannot find matching key for transaction`);
    }

    const account = (this.getAccount() as unknown) as SputnikConnectedWalletAccount;

    const trx = await Promise.all(
      transactionsConf.map(({ receiverId, actions }, i) =>
        this.buildTransaction(
          receiverId,
          accessKey.nonce + i + 1,
          actions.map(action => (action as unknown) as Action)
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
    const accountId = this.getAccountId();
    const block = await this.near.connection.provider.block({
      finality: 'final',
    });
    const blockHash = utils.serialize.base_decode(block.header.hash);

    const keyPair = await this.keyStore.getKey(
      this.config.networkId,
      this.getAccountId()
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
