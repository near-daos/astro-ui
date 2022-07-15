// import first from 'lodash/first';
//
// import { ConnectedWalletAccount } from 'near-api-js';
// import { KeyStore } from 'near-api-js/lib/key_stores';
// import { FunctionCallOptions } from 'near-api-js/lib/account';
// import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
// import { Wallet } from '@near-wallet-selector/core/lib/wallet/wallet.types';
//
// import { WalletType } from 'types/config';
// import { Transaction, SignInOptions, WalletMeta, WalletService } from './types';
//
// export class WalletSelectorService implements WalletService {
//   private wallet: Wallet;
//
//   private walletInfo: WalletMeta;
//
//   constructor(wallet: Wallet) {
//     this.wallet = wallet;
//
//     this.walletInfo =
//       wallet.id === WalletType.SELECTOR_NEAR
//         ? {
//             name: 'NEAR',
//             type: 'web',
//             url: 'wallet.near.org',
//             id: WalletType.SELECTOR_NEAR,
//           }
//         : {
//             name: 'Sender (beta)',
//             type: 'extension',
//             url: 'senderwallet.io',
//             id: WalletType.SELECTOR_SENDER,
//           };
//   }
//
//   functionCall(props: FunctionCallOptions): Promise<FinalExecutionOutcome[]> {
//     return Promise.resolve([]);
//   }
//
//   // can not implement
//   getAccount(): ConnectedWalletAccount {
//     return new ConnectedWalletAccount(this.wallet);
//   }
//
//   async getAccountId(): Promise<string> {
//     const accounts = await this.wallet.getAccounts();
//     const { accountId = '' } = first(accounts) || {};
//
//     return accountId;
//   }
//
//   getAvailableAccounts(): Promise<string[]> {
//     return Promise.resolve([]);
//   }
//
//   // TODO requires lib changes
//   // eslint-disable-next-line class-methods-use-this
//   getKeyStore(): KeyStore {
//     return null;
//   }
//
//   // TODO requires lib changes
//   // eslint-disable-next-line class-methods-use-this
//   getPublicKey(): Promise<string | null> {
//     return Promise.resolve(null);
//   }
//
//   // TODO requires lib changes
//   // eslint-disable-next-line class-methods-use-this
//   getSignature(): Promise<string | null> {
//     return Promise.resolve(null);
//   }
//
//   getWalletType(): WalletType {
//     return this.wallet.id as WalletType;
//   }
//
//   async isSignedIn(): Promise<boolean> {
//     const accountId = await this.getAccountId();
//
//     return !!accountId;
//   }
//
//   logout(): void {}
//
//   sendMoney(
//     receiverId: string,
//     amount: number
//   ): Promise<FinalExecutionOutcome[]> {
//     return Promise.resolve([]);
//   }
//
//   sendTransactions(
//     transactions: Transaction[]
//   ): Promise<FinalExecutionOutcome[]> {
//     return Promise.resolve([]);
//   }
//
//   signIn(contractId: string, signInOptions?: SignInOptions): Promise<boolean> {
//     return Promise.resolve(false);
//   }
//
//   walletMeta(): WalletMeta {
//     return this.walletInfo;
//   }
// }

export class WalletSelectorService {}
