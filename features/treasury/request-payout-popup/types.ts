import { BondDetail, VoteDetail } from 'features/types';

export type CreatePayoutInput = {
  tokenSymbol?: string;
  amount?: number;
  recipient?: string;
  payoutDetail?: string;
  externalUrl?: string;
  tokenAddress?: string;
  voteDetails?: VoteDetail[];
  bondDetail?: BondDetail;
};
