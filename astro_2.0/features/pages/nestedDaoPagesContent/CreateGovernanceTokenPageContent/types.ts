import { Contract } from 'near-api-js';

export interface CustomContract extends Contract {
  // eslint-disable-next-line camelcase
  ft_balance_of: (params: { account_id: string }) => Promise<string>;
  // eslint-disable-next-line camelcase
  ft_metadata: () => Promise<{ symbol: string; decimals: number }>;
}
