import { Contract } from 'near-api-js';

export type UserDelegateDetails = {
  accountId: string;
  delegatedBalance: number;
  stakedBalance: string;
};

export type DelegateTokenDetails = {
  balance: number;
  symbol: string;
  decimals: number;
};

/* eslint-disable camelcase */
export interface CustomContract extends Contract {
  ft_balance_of: (params: { account_id: string }) => Promise<string>;
  get_user: (params: { account_id: string }) => Promise<{
    delegated_amounts: [string, string][];
    vote_amount: string;
    next_action_timestamp: string;
  }>;
  ft_metadata: () => Promise<{ symbol: string; decimals: number }>;
  delegation_total_supply: () => Promise<string>;
}
