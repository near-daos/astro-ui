import {
  ConnectedWalletAccount,
  keyStores,
  Near,
  transactions,
  utils,
} from 'near-api-js';
import { SputnikWalletConnection } from 'services/sputnik/SputnikNearService/overrides/SputnikWalletConnection';
import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores';
import { AccessKey, Action, transfer } from 'near-api-js/lib/transaction';
import { SputnikConnectedWalletAccount } from 'services/sputnik/SputnikNearService/overrides/SputnikConnectedWalletAccount';
import compact from 'lodash/compact';
import { WalletType } from 'types/config';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { FunctionCallOptions } from 'near-api-js/lib/account';
import { getSignature } from 'services/sputnik/SputnikNearService/services/helpers';
import {
  WalletService,
  Transaction,
} from 'services/sputnik/SputnikNearService/services/types';
import BN from 'bn.js';
import { NearConfig } from 'config/near';
import { parseNearAmount } from 'near-api-js/lib/utils/format';

export class SputnikWalletService implements WalletService {
  private readonly near: Near;

  private readonly walletType = WalletType.NEAR;

  private walletConnection!: SputnikWalletConnection;

  private readonly config: NearConfig;

  private keyStore?: BrowserLocalStorageKeyStore;

  public readonly successUrl: string = `${window.origin}/callback/auth`;

  public readonly failureUrl: string = `${window.origin}/callback/auth`;

  constructor(nearConfig: NearConfig) {
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    this.config = nearConfig;

    this.keyStore = keyStore;
    this.near = new Near({
      ...nearConfig,
      keyStore,
    });

    this.walletConnection = new SputnikWalletConnection(this.near, 'sputnik');
    window.localStorage.setItem('selectedWallet', WalletType.NEAR.toString());
  }

  isSignedIn(): boolean {
    return !!this.walletConnection && this.getAccountId() !== '';
  }

  async functionCall(
    props: FunctionCallOptions
  ): Promise<FinalExecutionOutcome[]> {
    const accountId = this.getAccountId();

    const result = await this.getAccount().functionCall({
      ...props,
      walletCallbackUrl: `${window.origin}/api/server/v1/transactions/wallet/callback/${accountId}`,
    });

    return [result];
  }

  public async signIn(contractId: string): Promise<void> {
    await this.walletConnection.sputnikRequestSignIn(
      contractId,
      this.successUrl,
      this.failureUrl
    );

    window.localStorage.setItem('selectedWallet', WalletType.NEAR.toString());
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

    const block = await this.near.connection.provider.block({
      finality: 'final',
    });
    const blockHash = utils.serialize.base_decode(block.header.hash);

    const account = (this.getAccount() as unknown) as SputnikConnectedWalletAccount;

    const trx = await Promise.all(
      transactionsConf.map(({ receiverId, actions }, i) =>
        this.buildTransaction(
          receiverId,
          accessKey.nonce + i + 1,
          actions.map(action => (action as unknown) as Action),
          blockHash
        )
      )
    );

    return account.sendTransactions(compact(trx));
  }

  private async buildTransaction(
    contractId: string,
    nonce: number,
    actions: transactions.Action[],
    blockHash: Uint8Array
  ) {
    const accountId = this.getAccountId();

    const keyPair = this.config
      ? await this.keyStore?.getKey(this.config.networkId, this.getAccountId())
      : null;

    const publicKey = keyPair?.getPublicKey();

    if (!publicKey) {
      return null;
    }

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
