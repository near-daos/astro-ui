import { BondDetail, Token, VoteDetail } from 'features/types';

export type CreatePayoutInput = {
  token?: Token;
  amount?: number;
  recipient?: string;
  payoutDetail?: string;
  externalUrl?: string;
  voteDetails: VoteDetail[];
  bondDetail: BondDetail;
};
