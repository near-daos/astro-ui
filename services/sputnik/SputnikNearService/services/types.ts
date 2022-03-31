import { CreateDaoParams } from 'services/sputnik/types';
import { CreateProposalParams } from 'types/proposal';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { ConnectedWalletAccount, transactions } from 'near-api-js';
import { FunctionCallOptions } from 'near-api-js/lib/account';
import { WalletType } from 'types/config';

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
  signIn(contractId: string): Promise<void>;
  sendMoney(
    receiverId: string,
    amount: number
  ): Promise<FinalExecutionOutcome[]>;
  getWalletType(): WalletType;
  logout(): void;
  isSignedIn(): boolean;
  getAccount(): ConnectedWalletAccount;
  getAccountId(): string;
  functionCall(props: FunctionCallOptions): Promise<FinalExecutionOutcome[]>;
  getPublicKey(): Promise<string | null>;
  getSignature(): Promise<string | null>;
  sendTransactions(
    transactions: Transaction[]
  ): Promise<FinalExecutionOutcome[]>;
}

type SignInOptions = {
  contractId: string;
  methodNames?: string[];
};

export type Transaction = {
  receiverId: string;
  actions: transactions.Action[] | SenderAction[];
};

export type SenderWalletTransactionResult = {
  actionType: string;
  method: string;
  notificationId: number;
  type: string;
  response: FinalExecutionOutcome[];
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
  requestSignIn: (signInOptions: SignInOptions) => Promise<void>;
  account: () => ConnectedWalletAccount;
};
