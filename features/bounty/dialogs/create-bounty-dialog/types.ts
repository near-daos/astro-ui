import { DeadlineUnit } from 'components/cards/bounty-card/types';

export type Token = 'NEAR';

export type CreateBountyInput = {
  token: Token;
  amount: number;
  group: string;
  externalUrl: string;
  slots: number;
  deadlineThreshold: number;
  deadlineUnit: DeadlineUnit;
};

export type Option = {
  label: string;
  value: string;
};
