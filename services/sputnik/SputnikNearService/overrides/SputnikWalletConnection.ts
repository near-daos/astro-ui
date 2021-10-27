/* eslint-disable no-underscore-dangle */
import * as borsh from 'borsh';
import { reject } from 'lodash';
import { KeyPair, WalletConnection, ConnectedWalletAccount } from 'near-api-js';
import { Transaction, SCHEMA } from 'near-api-js/lib/transaction';

import { SputnikConnectedWalletAccount } from './SputnikConnectedWalletAccount';

const LOGIN_WALLET_URL_SUFFIX = '/login/';
const PENDING_ACCESS_KEY_PREFIX = 'pending_key';

type SputnikRequestSignTransactionsOptions = {
  transactions: Transaction[];
  callbackUrl: string;
  meta?: string;
};

export class SputnikWalletConnection extends WalletConnection {
  public signTransactionUrl: string | null = null;

  async sputnikRequestSignIn(
    contractId: string,
    successUrl: string,
    failureUrl: string
  ): Promise<string | undefined> {
    const accessKey = KeyPair.fromRandom('ed25519');

    const newUrl = new URL(this._walletBaseUrl + LOGIN_WALLET_URL_SUFFIX);

    newUrl.searchParams.set('success_url', successUrl);
    newUrl.searchParams.set('failure_url', failureUrl);
    newUrl.searchParams.set('contract_id', contractId);
    newUrl.searchParams.set('public_key', accessKey.getPublicKey().toString());

    const win = window.open(`${window.origin}/callback/pending`, '_blank');

    await this._keyStore.setKey(
      this._networkId,
      PENDING_ACCESS_KEY_PREFIX + accessKey.getPublicKey(),
      accessKey
    );

    return new Promise<string | undefined>(resolve => {
      if (win?.location) {
        win.location.href = newUrl.toString();
      }

      window.sputnikRequestSignInCompleted = async ({
        accountId,
        errorCode = 'unknown',
      }) => {
        win?.close();

        if (accountId) {
          resolve(accountId);

          return;
        }

        reject(new Error(errorCode));
      };
    });
  }

  async sputnikRequestSignTransactions({
    transactions,
    callbackUrl,
    meta,
  }: SputnikRequestSignTransactionsOptions): Promise<void> {
    const newUrl = new URL('sign', this._walletBaseUrl);

    const transactionsString = transactions
      .map(transaction => borsh.serialize(SCHEMA, transaction))
      .map(serialized => Buffer.from(serialized).toString('base64'))
      .join(',');

    newUrl.searchParams.set('transactions', transactionsString);
    newUrl.searchParams.set('callbackUrl', callbackUrl);

    if (meta) {
      newUrl.searchParams.set('meta', meta);
    }

    this.signTransactionUrl = newUrl.toString();
  }

  account(): ConnectedWalletAccount {
    if (!this._connectedAccount) {
      this._connectedAccount = new SputnikConnectedWalletAccount(
        this,
        this._near.connection,
        this._authData.accountId
      );
    }

    return this._connectedAccount;
  }
}
