import { Token } from 'types/token';

export interface ChartData {
  balance: number;
  timestamp: number;
}

export type TransactionType = 'Deposit' | 'Withdraw';

export interface TransactionCardInput {
  type: TransactionType;
  transactionId: string;
  tokenName: Token;
  tokensBalance: number;
  date: string;
  accountName: string;
}
