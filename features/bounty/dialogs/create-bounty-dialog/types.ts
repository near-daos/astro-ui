import { DeadlineUnit } from 'components/cards/bounty-card/types';

export type CreateBountyInput = {
  token: string;
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
