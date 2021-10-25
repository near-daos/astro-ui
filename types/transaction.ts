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
  date: string;
};
