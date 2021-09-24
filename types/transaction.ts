export type Transaction = {
  transactionId: string;
  timestamp: number;
  date: string;
  receiverAccountId: string;
  signerAccountId: string;
  deposit: string;
  type: 'Deposit' | 'Withdraw';
};
