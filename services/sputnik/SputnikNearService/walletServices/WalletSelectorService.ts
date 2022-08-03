/* eslint-disable @typescript-eslint/ban-ts-comment */

import BN from 'bn.js';
import map from 'lodash/map';
import first from 'lodash/first';
import { KeyStore } from 'near-api-js/lib/key_stores';
import { FunctionCallOptions } from 'near-api-js/lib/account';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { ConnectedWalletAccount, providers } from 'near-api-js';
import { BrowserWallet, WalletSelector } from '@near-wallet-selector/core';
import { FinalExecutionOutcome, Provider } from 'near-api-js/lib/providers';
import { Wallet } from '@near-wallet-selector/core/lib/wallet/wallet.types';

import { WalletType } from 'types/config';
import { TransactionCompleted } from 'global';

import {
  SputnikWalletError,
  SputnikWalletErrorCodes,
} from 'errors/SputnikWalletError';

import { TRANSACTIONS_KEY } from 'constants/localStorage';
import { SELECTOR_TRANSACTION_PAGE_URL } from 'constants/routing';

import { configService } from 'services/ConfigService';

import { Transaction, SignInOptions, WalletMeta, WalletService } from './types';

export class WalletSelectorService implements WalletService {
  private wallet: Wallet;

  private selector: WalletSelector;

  private provider: Provider;

  private walletInfo: WalletMeta;

  constructor(wallet: Wallet, selector: WalletSelector) {
    const { nearConfig } = configService.get();

    this.provider = new providers.JsonRpcProvider(nearConfig.nodeUrl);

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

  private getOnTransactionsCompleteHandler(
    resolve: (data: FinalExecutionOutcome[]) => void,
    reject: (error: unknown) => void
  ) {
    async function handler(
      result: TransactionCompleted & { accountId: string }
    ) {
      const { accountId, transactionHashes, errorCode } = result;

      if (transactionHashes || errorCode) {
        if (errorCode) {
          reject(
            new SputnikWalletError({
              errorCode: errorCode || SputnikWalletErrorCodes.unknownError,
            })
          );
        }

        const hashes = transactionHashes?.split(',') || [];

        const statuses = await Promise.all<FinalExecutionOutcome>(
          // @ts-ignore
          hashes.map(hash => this.provider.txStatus(hash, accountId))
        );

        resolve(statuses);
      }
    }

    return handler.bind(this);
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

  logout(): Promise<void> {
    return this.wallet.signOut();
  }

  // eslint-disable-next-line class-methods-use-this
  sendMoney(
    receiverId: string,
    amount: number
  ): Promise<FinalExecutionOutcome[]> {
    return new Promise((resolve, reject) => {
      const parsedNear = parseNearAmount(amount.toString());

      const nearAsBn = new BN(parsedNear ?? 0);

      const args = JSON.stringify({
        receiverId,
        actions: [
          {
            type: 'Transfer',
            params: {
              deposit: nearAsBn.toString(),
            },
          },
        ],
      });

      window.onTransaction = this.getOnTransactionsCompleteHandler(
        resolve,
        reject
      );

      window.open(
        `${window.origin}${SELECTOR_TRANSACTION_PAGE_URL}?${TRANSACTIONS_KEY}=${args}`,
        '_blank'
      );
    });
  }

  // TODO TBD
  // eslint-disable-next-line class-methods-use-this
  sendTransactions(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transactions: Transaction[]
  ): Promise<FinalExecutionOutcome[]> {
    return Promise.resolve([]);
  }

  async signIn(
    contractId: string,
    signInOptions?: SignInOptions
  ): Promise<boolean> {
    const wallet = this.wallet as BrowserWallet;

    await wallet.signIn({ contractId, ...signInOptions });

    return Promise.resolve(true);
  }

  walletMeta(): WalletMeta {
    return this.walletInfo;
  }
}
