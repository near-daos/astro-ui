import { CreateDaoParams } from 'services/sputnik/types';
import { CreateProposalParams } from 'types/proposal';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { ConnectedWalletAccount, transactions } from 'near-api-js';
import { FunctionCallOptions } from 'near-api-js/lib/account';
import { WalletType } from 'types/config';
import { KeyStore } from 'near-api-js/lib/key_stores';

export interface DaoService {
  createDao(params: CreateDaoParams): Promise<void>;

  addProposal(params: CreateProposalParams): Promise<FinalExecutionOutcome[]>;

  vote(
    daoId: string,
    proposalId: number,
    action: 'VoteApprove' | 'VoteRemove' | 'VoteReject',
    gas?: string | number
  ): Promise<FinalExecutionOutcome[]>;

  finalize(daoId: string, proposalId: number): Promise<FinalExecutionOutcome[]>;

  claimBounty(
    daoId: string,
    args: {
      bountyId: number;
      deadline: string;
      bountyBond: string;
      gas?: string | number;
      tokenId?: string;
    }
  ): Promise<FinalExecutionOutcome[]>;

  nearAccountExist(account: string): Promise<boolean>;

  unclaimBounty(
    daoId: string,
    bountyId: number,
    gas?: string | number
  ): Promise<FinalExecutionOutcome[]>;
}

export interface WalletService {
  signIn(contractId: string, signInOptions?: SignInOptions): Promise<boolean>;
  sendMoney(
    receiverId: string,
    amount: number
  ): Promise<FinalExecutionOutcome[]>;
  getWalletType(): WalletType;
  getKeyStore(): KeyStore;
  logout(): Promise<void>;
  isSignedIn(): Promise<boolean>;
  getAccount(): ConnectedWalletAccount;
  getAccountId(): Promise<string>;
  getAvailableAccounts(): Promise<string[]>;
  functionCall(props: FunctionCallOptions): Promise<FinalExecutionOutcome[]>;
  getPublicKey(): Promise<string | null>;
  getSignature(): Promise<string | null>;
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
  actions: transactions.Action[] | SenderAction[];
};

export type FinalExecutionError = {
  error: {
    kind: {
      ExecutionError: string;
    };
  };
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
  }) => Promise<SenderWalletTransactionResult>;
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
