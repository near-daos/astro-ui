export type TransactionType = 'Deposit' | 'Withdraw';

export type Transaction = {
  transactionId: string;
  timestamp: number;
  date: string;
  receiverAccountId: string;
  signerAccountId: string;
  deposit: string;
  type: TransactionType;
};

export type Receipt = {
  receiptId: string;
  timestamp: number;
  receiverAccountId: string;
  predecessorAccountId: string;
  deposit: string;
  type: TransactionType;
  txHash: string;
  date: string;
  token: string;
};

export enum TransactionResultType {
  PROPOSAL_CREATE = 'ProposalCreate',
  DAO_CREATE = 'DaoCreate',
  PROPOSAL_VOTE = 'ProposalVote',
  BOUNTY_CLAIM = 'BountyClaim',
  FINALIZE = 'Finalize',
}

export type TransactionResult = {
  type: TransactionResultType;
  metadata: Record<string, string>;
};
