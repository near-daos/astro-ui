/* eslint-disable no-underscore-dangle */
import * as borsh from 'borsh';
import {
  ConnectedWalletAccount,
  transactions as Transactions
} from 'near-api-js';
import { PublicKey } from 'near-api-js/lib/utils';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';

import { SputnikWalletConnection } from './types';

export class SputnikConnectedWalletAccount extends ConnectedWalletAccount {
  protected async signAndSendTransaction(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ): Promise<FinalExecutionOutcome> {
    let options = args[0];

    if (typeof args[0] === 'string') {
      options = {
        receiverId: args[0],
        actions: args[1]
      };
    }

    const { receiverId, actions, walletMeta } = options;
    const walletConnection = this.walletConnection as SputnikWalletConnection;

    const win = window.open(`${window.origin}/pending`, '_blank');

    const localKey = await this.connection.signer.getPublicKey(
      this.accountId,
      this.connection.networkId
    );
    let accessKey = await this.accessKeyForTransaction(
      receiverId,
      actions,
      localKey
    );

    if (!accessKey) {
      throw new Error(
        `Cannot find matching key for transaction sent to ${receiverId}`
      );
    }

    if (localKey && localKey.toString() === accessKey.public_key) {
      try {
        return await super.signAndSendTransaction({
          receiverId,
          actions
        });
      } catch (e) {
        if (e.type === 'NotEnoughAllowance') {
          accessKey = await this.accessKeyForTransaction(receiverId, actions);
        } else {
          throw e;
        }
      }
    }

    const block = await this.connection.provider.block({
      finality: 'final'
    });

    const blockHash = borsh.baseDecode(block.header.hash);
    const publicKey = PublicKey.from(accessKey.public_key);
    // TODO: Cache & listen for nonce updates for given access key
    const nonce = accessKey.access_key.nonce + 1;

    const transaction = Transactions.createTransaction(
      this.accountId,
      publicKey,
      receiverId,
      nonce,
      actions,
      blockHash
    );

    await walletConnection.sputnikRequestSignTransactions({
      transactions: [transaction],
      meta: walletMeta,
      callbackUrl: `${window.origin}/callback/transaction`
    });

    if (win?.location && walletConnection.signTransactionUrl) {
      win.location.href = walletConnection.signTransactionUrl;
    }

    return new Promise((resolve, reject) => {
      window.sputnikRequestSignTransactionCompleted = async ({
        transactionHashes,
        errorCode
      }) => {
        if (typeof transactionHashes === 'string') {
          const result = await this.connection.provider.txStatus(
            transactionHashes,
            this.accountId
          );

          resolve(result);
        }

        if (errorCode) {
          reject(new Error(errorCode));
        }

        reject(new Error('Something went wrong!'));
      };
    });
  }
}
