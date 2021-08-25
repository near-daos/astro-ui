import { TokenName } from 'components/cards/token-card';

export interface ChartData {
  balance: number;
  timestamp: number;
}

export type TransactionType = 'Deposit' | 'Windrow';

export interface TransactionCardInput {
  type: TransactionType;
  transactionId: string;
  tokenName: TokenName;
  tokensBalance: number;
  date: string;
  accountName: string;
}
