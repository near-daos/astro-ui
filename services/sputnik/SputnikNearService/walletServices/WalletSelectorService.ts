/* eslint-disable @typescript-eslint/ban-ts-comment */

import map from 'lodash/map';
import first from 'lodash/first';
import { BrowserWallet, WalletSelector } from '@near-wallet-selector/core';

import { ConnectedWalletAccount } from 'near-api-js';
import { KeyStore } from 'near-api-js/lib/key_stores';
import { FunctionCallOptions } from 'near-api-js/lib/account';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { Wallet } from '@near-wallet-selector/core/lib/wallet/wallet.types';

import { WalletType } from 'types/config';
import { Transaction, SignInOptions, WalletMeta, WalletService } from './types';

export class WalletSelectorService implements WalletService {
  private wallet: Wallet;

  private selector: WalletSelector;

  private walletInfo: WalletMeta;

  constructor(wallet: Wallet, selector: WalletSelector) {
    this.selector = selector;
    this.wallet = wallet;

    this.walletInfo =
      wallet.id === WalletType.SELECTOR_NEAR
        ? {
            name: 'NEAR',
            type: 'web',
            url: 'wallet.near.org',
            id: WalletType.SELECTOR_NEAR,
          }
        : {
            name: 'Sender (beta)',
            type: 'extension',
            url: 'senderwallet.io',
            id: WalletType.SELECTOR_SENDER,
          };
  }

  // TODO TBD
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  functionCall(props: FunctionCallOptions): Promise<FinalExecutionOutcome[]> {
    return Promise.resolve([]);
  }

  // TODO implement after lib changes
  // eslint-disable-next-line class-methods-use-this
  getAccount(): ConnectedWalletAccount {
    // @ts-ignore
    return null;
  }

  async getAccountId(): Promise<string> {
    const accounts = await this.wallet.getAccounts();
    const { accountId = '' } = first(accounts) || {};

    return accountId;
  }

  async getAvailableAccounts(): Promise<string[]> {
    const accounts = await this.wallet.getAccounts();
    const accountIds = map(accounts, 'accountId');

    return Promise.resolve(accountIds);
  }

  // TODO implement after lib changes
  // eslint-disable-next-line class-methods-use-this
  getKeyStore(): KeyStore {
    // @ts-ignore
    return null;
  }

  // TODO implement after lib changes
  // eslint-disable-next-line class-methods-use-this
  getPublicKey(): Promise<string | null> {
    return Promise.resolve(null);
  }

  // TODO implement after lib changes
  // eslint-disable-next-line class-methods-use-this
  getSignature(): Promise<string | null> {
    return Promise.resolve(null);
  }

  getWalletType(): WalletType {
    return this.wallet.id as WalletType;
  }

  isSignedIn(): Promise<boolean> {
    return Promise.resolve(this.selector.isSignedIn());
  }

  logout(): void {
    this.wallet.signOut();
  }

  // TODO TBD
  // eslint-disable-next-line class-methods-use-this
  sendMoney(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    receiverId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    amount: number
  ): Promise<FinalExecutionOutcome[]> {
    return Promise.resolve([]);
  }

  // TODO TBD
  // eslint-disable-next-line class-methods-use-this
  sendTransactions(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transactions: Transaction[]
  ): Promise<FinalExecutionOutcome[]> {
    return Promise.resolve([]);
  }

  signIn(contractId: string, signInOptions?: SignInOptions): Promise<boolean> {
    const wallet = this.wallet as BrowserWallet;

    wallet.signIn({ contractId, ...signInOptions });

    return Promise.resolve(true);
  }

  walletMeta(): WalletMeta {
    return this.walletInfo;
  }
}
