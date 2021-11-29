import { Token } from 'types/token';
import { BountyStatus } from 'types/bounties';

export enum CardType {
  Bounty = 'Bounty',
  Claim = 'Claim',
}
export interface BountyCardContent {
  id: string;
  daoId: string;
  amount: string;
  type: CardType;
  description: string;
  externalUrl?: string;
  token: Token;
  status: BountyStatus;
  bountyBond: string;
  slots?: number;
  claimedByCurrentUser: boolean;
  accountId?: string;
  timeToComplete: string;
  forgivenessPeriod: string;
}
