/* eslint-disable @typescript-eslint/ban-ts-comment, class-methods-use-this */

import BN from 'bn.js';
import map from 'lodash/map';
import first from 'lodash/first';
import { FunctionCallOptions } from 'near-api-js/lib/account';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { keyStores, providers, Signer } from 'near-api-js';
import { BrowserWallet, WalletSelector } from '@near-wallet-selector/core';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { Wallet } from '@near-wallet-selector/core/lib/wallet/wallet.types';
import {
  FunctionCallAction,
  Transaction as SelectorTransaction,
} from '@near-wallet-selector/core/lib/wallet';

import { WalletType } from 'types/config';
import { TransactionCompleted } from 'global';

import {
  SputnikWalletError,
  SputnikWalletErrorCodes,
} from 'errors/SputnikWalletError';

import { configService } from 'services/ConfigService';

import { PkAndSignature } from 'context/WalletContext/types';
import { AccountView } from 'near-api-js/lib/providers/provider';
import { RpcService } from 'services/sputnik/SputnikNearService/walletServices/RpcService';
import { KeyStore } from 'near-api-js/lib/key_stores';
import { Transaction, WalletMeta, WalletService } from './types';
import {
  getSignature,
  isFinalExecutionOutcome,
  isFinalExecutionOutcomeResponse,
  triggerTransactionCallback,
} from './helpers';

export class WalletSelectorService implements WalletService {
  private wallet: Wallet;

  private selector: WalletSelector;

  private rpcService: RpcService;

  private walletInfo: WalletMeta;

  constructor(wallet: Wallet, selector: WalletSelector) {
    const { nearConfig } = configService.get();

    this.rpcService = new RpcService(
      new providers.JsonRpcProvider(nearConfig.nodeUrl)
    );

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

  getKeyStore(): KeyStore {
    if (this.walletInfo.id === WalletType.SELECTOR_NEAR) {
      return new keyStores.BrowserLocalStorageKeyStore(window.localStorage);
    }

    const connectionObj = window.near?.account()?.connection;

    if (connectionObj) {
      const { signer } = connectionObj;

      const { keyStore } = signer as { keyStore: KeyStore } & Signer;

      return keyStore;
    }

    return new keyStores.BrowserLocalStorageKeyStore(window.localStorage);
  }

  async contractCall<T>(
    accountId: string,
    methodName: string,
    argsAsBase64: string
  ): Promise<T> {
    return this.rpcService.contractCall(accountId, methodName, argsAsBase64);
  }

  viewAccount(accountId: string): Promise<AccountView> {
    return this.rpcService.viewAccount(accountId);
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

  async functionCall(
    props: FunctionCallOptions
  ): Promise<FinalExecutionOutcome[]> {
    const { args, contractId, gas, methodName, attachedDeposit } = props;

    const accountId = await this.getAccountId();

    const res = await this.wallet.signAndSendTransaction({
      callbackUrl: `${window.origin}/api/server/v1/transactions/wallet/callback/${accountId}`,
      receiverId: contractId,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName,
            args,
            gas: gas?.toString() ?? '0',
            deposit: attachedDeposit?.toString() || '0',
          },
        },
      ],
    });

    // In case of Selector sender wallet we have to manually notify BE about transaction results
    if (
      this.walletInfo.id === WalletType.SELECTOR_SENDER &&
      isFinalExecutionOutcome(res)
    ) {
      await triggerTransactionCallback(res);
    }

    return [res as FinalExecutionOutcome];
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

  async getPkAndSignatureFromLocalKeyStore(): Promise<PkAndSignature | null> {
    const accountId = await this.getAccountId();

    const { nearConfig } = configService.get();

    const keyStore = this.getKeyStore();

    const keyPair = await keyStore.getKey(nearConfig.networkId, accountId);

    if (!keyPair) {
      return null;
    }

    const publicKey = keyPair.getPublicKey();

    if (!publicKey) {
      return null;
    }

    return {
      publicKey: publicKey.toString(),
      signature: await getSignature(keyPair),
    };
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

  // TODO works only for NEAR wallet. Has to be updated for Sender wallet
  async sendMoney(
    receiverId: string,
    amount: number
  ): Promise<FinalExecutionOutcome[]> {
    const parsedNear = parseNearAmount(amount.toString());

    const nearAsBn = new BN(parsedNear ?? 0);

    const accountId = await this.getAccountId();

    const res = await this.wallet.signAndSendTransaction({
      callbackUrl: `${window.origin}/api/server/v1/transactions/wallet/callback/${accountId}`,
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

    // In case of Selector sender wallet we have to manually notify BE about transaction results
    if (
      this.walletInfo.id === WalletType.SELECTOR_SENDER &&
      isFinalExecutionOutcome(res)
    ) {
      await triggerTransactionCallback(res);
    }

    return [res as FinalExecutionOutcome];
  }

  async sendTransactions(
    transactions: Transaction[]
  ): Promise<FinalExecutionOutcome[]> {
    const accountId = await this.getAccountId();

    const trx: SelectorTransaction[] = transactions.map(item => ({
      ...item,
      signerId: accountId,
      actions: item.actions.map(action => action as FunctionCallAction),
    }));

    return new Promise((resolve, reject) => {
      this.wallet
        .signAndSendTransactions({
          callbackUrl: `${window.origin}/api/server/v1/transactions/wallet/callback/${accountId}`,
          transactions: trx,
        })
        .then(async resp => {
          // In case of Selector sender wallet we have to manually notify BE about transaction results
          if (isFinalExecutionOutcomeResponse(resp)) {
            await triggerTransactionCallback(resp[0]);

            resolve(resp);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  async signIn(contractId: string): Promise<boolean> {
    const wallet = this.wallet as BrowserWallet;

    await wallet.signIn({ contractId });

    return Promise.resolve(true);
  }

  walletMeta(): WalletMeta {
    return this.walletInfo;
  }

  getPkAndSignature(): Promise<PkAndSignature | null> {
    return this.getPkAndSignatureFromLocalKeyStore();
  }
}
