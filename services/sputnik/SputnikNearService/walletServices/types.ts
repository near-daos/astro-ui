import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { ConnectedWalletAccount, transactions } from 'near-api-js';
import { FunctionCallOptions } from 'near-api-js/lib/account';
import { WalletType } from 'types/config';
import { KeyStore } from 'near-api-js/lib/key_stores';
import { Action } from '@near-wallet-selector/core/lib/wallet/transactions.types';
import {
  AccountView,
  QueryResponseKind,
} from 'near-api-js/lib/providers/provider';
import { PkAndSignature } from 'context/WalletContext/types';

export interface RpcCallResult extends QueryResponseKind {
  result: Uint8Array;
}

export interface WalletService {
  signIn(contractId: string, signInOptions?: SignInOptions): Promise<boolean>;
  sendMoney(
    receiverId: string,
    amount: number
  ): Promise<FinalExecutionOutcome[]>;
  viewAccount(accountId: string): Promise<AccountView>;
  contractCall<T>(
    accountId: string,
    methodName: string,
    argsAsBase64: string
  ): Promise<T>;
  getWalletType(): WalletType;
  getKeyStore(): KeyStore;
  logout(): Promise<void>;
  isSignedIn(): Promise<boolean>;
  getAccountId(): Promise<string>;
  getAvailableAccounts(): Promise<string[]>;
  functionCall(props: FunctionCallOptions): Promise<FinalExecutionOutcome[]>;
  getPkAndSignature(): Promise<PkAndSignature | null>;
  sendTransactions(
    transactions: Transaction[]
  ): Promise<FinalExecutionOutcome[]>;
  walletMeta(): WalletMeta;
}

export type WalletMeta = {
  id: WalletType;
  name: string;
  type: string;
  url: string;
};

export type SignInOptions = {
  contractId: string;
  methodNames?: string[];
};

export type Transaction = {
  receiverId: string;
  actions: transactions.Action[] | SenderAction[] | Action[];
};

export type FinalExecutionError = {
  error: {
    kind: {
      ExecutionError: string;
    };
  };
};

export type SenderWalletExtensionResult = {
  actionType: string;
  error: string;
  notificationId: number;
  type: string;
};

export type SenderWalletTransactionResult = {
  actionType: string;
  method: string;
  notificationId: number;
  type: string;
  response: FinalExecutionOutcome[] | FinalExecutionError;
};

export type SenderAction = {
  methodName: string;
  args: Record<string, unknown>;
  gas?: string;
  deposit?: string;
  amount?: string;
};

export type SenderWalletInstance = {
  isSender: boolean;
  accountId: string;
  isSignedIn: () => boolean;
  sendMoney: (params: {
    receiverId: string;
    amount: string;
  }) => Promise<SenderWalletTransactionResult>;
  signAndSendTransaction: (transaction: {
    receiverId: string;
    actions: SenderAction[];
  }) => Promise<SenderWalletTransactionResult>;
  requestSignTransactions: (transactions: {
    transactions: Transaction[];
  }) => Promise<SenderWalletTransactionResult | SenderWalletExtensionResult>;
  signOut: () => void;
  authData: {
    accountId: string;
    accessKey: {
      publicKey: string;
      secretKey: string;
    };
  };
  on: () => void;
  requestSignIn: (signInOptions: SignInOptions) => Promise<unknown>;
  account: () => ConnectedWalletAccount;
};
