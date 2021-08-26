/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import * as borsh from 'borsh';
import {
  ConnectedWalletAccount,
  transactions as Transactions
} from 'near-api-js';
import { PublicKey } from 'near-api-js/lib/utils';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';

// todo refactor
// @ts-ignore
export class SputnikConnectedWalletAccount extends ConnectedWalletAccount {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async _signAndSendTransaction({
    receiverId,
    actions,
    walletMeta,
    walletCallbackUrl = window.location.href
  }: any): Promise<FinalExecutionOutcome> {
    const win = window.open(window.origin, '_blank');

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

    await this.walletConnection.requestSignTransactions({
      transactions: [transaction],
      meta: walletMeta,
      callbackUrl: walletCallbackUrl
    });

    if (win?.location) {
      win.location.href = (this.walletConnection as any).signTransactionUrl;
    }

    // todo refactor
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Promise(() => {});
  }
}
