import { DeadlineUnit } from 'components/cards/bounty-card/types';
import { Token } from 'features/types';

export type CreateBountyInput = {
  token: Token;
  amount: number;
  details: string;
  externalUrl: string;
  tokenAddress?: string;
  slots: number;
  deadlineThreshold: number;
  deadlineUnit: DeadlineUnit;
};

export type Option = {
  label: string;
  value: string;
};
