/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import * as borsh from 'borsh';
import {
  WalletConnection,
  KeyPair,
  transactions as Transactions,
  ConnectedWalletAccount
} from 'near-api-js';
import { SputnikConnectedWalletAccount } from './SputnikConnectedWalletAccount';

interface SignInOptions {
  contractId?: string;
  methodNames?: string[];
  successUrl?: string;
  failureUrl?: string;
}

const LOGIN_WALLET_URL_SUFFIX = '/login/';
const PENDING_ACCESS_KEY_PREFIX = 'pending_key';

// todo refactor
// @ts-ignore
export class SputnikWalletConnection extends WalletConnection {
  public signTransactionUrl = '';

  async requestSignIn(
    contractIdOrOptions?: string | SignInOptions,
    title?: string,
    successUrl?: string,
    failureUrl?: string
  ): Promise<void> {
    const win = window.open(window.origin, '_blank');

    let options;

    if (typeof contractIdOrOptions === 'string') {
      options = {
        contractId: contractIdOrOptions,
        successUrl,
        failureUrl
      };
    } else {
      options = contractIdOrOptions;
    }

    const currentUrl = new URL(window.location.href);
    const newUrl = new URL(this._walletBaseUrl + LOGIN_WALLET_URL_SUFFIX);

    newUrl.searchParams.set(
      'success_url',
      options?.successUrl || currentUrl.href
    );
    newUrl.searchParams.set(
      'failure_url',
      options?.failureUrl || currentUrl.href
    );

    if (options?.contractId) {
      /* Throws exception if contract account does not exist */
      const contractAccount = await this._near.account(options.contractId);

      await contractAccount.state();
      newUrl.searchParams.set('contract_id', options.contractId);

      const accessKey = KeyPair.fromRandom('ed25519');

      newUrl.searchParams.set(
        'public_key',
        accessKey.getPublicKey().toString()
      );
      await this._keyStore.setKey(
        this._networkId,
        PENDING_ACCESS_KEY_PREFIX + accessKey.getPublicKey(),
        accessKey
      );
    }

    if (options?.methodNames) {
      options.methodNames.forEach(methodName => {
        newUrl.searchParams.append('methodNames', methodName);
      });
    }

    return new Promise<void>(resolve => {
      if (win?.location) {
        win.location.href = newUrl.toString();
      }

      window.sputnikRequestSignInCompleted = async () => {
        win?.close();
        resolve();
      };
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async _requestSignTransactions({ transactions, meta }: any): Promise<void> {
    const newUrl = new URL('sign', this._walletBaseUrl);

    newUrl.searchParams.set(
      'transactions',
      transactions
        .map((transaction: any) =>
          borsh.serialize(Transactions.SCHEMA, transaction)
        )
        .map(
          (serialized: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) =>
            Buffer.from(serialized).toString('base64')
        )
        .join(',')
    );

    newUrl.searchParams.set('callbackUrl', `${window.origin}/callback`);

    if (meta) {
      newUrl.searchParams.set('meta', meta);
    }

    this.signTransactionUrl = newUrl.toString();
  }

  account(): ConnectedWalletAccount {
    if (!this._connectedAccount) {
      // @ts-ignore
      this._connectedAccount = new SputnikConnectedWalletAccount(
        this as any,
        this._near.connection,
        this._authData.accountId
      );
    }

    return this._connectedAccount;
  }
}
