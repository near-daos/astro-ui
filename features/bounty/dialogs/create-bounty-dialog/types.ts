import { DeadlineUnit } from 'components/cards/bounty-card/types';
import { BondDetail, VoteDetail } from 'features/types';

export type Token = 'NEAR';

export type CreateBountyInput = {
  token: Token;
  amount: number;
  details: string;
  externalUrl: string;
  slots: number;
  deadlineThreshold: number;
  deadlineUnit: DeadlineUnit;
  voteDetails: VoteDetail[];
  bondDetail: BondDetail;
};

export type Option = {
  label: string;
  value: string;
};
