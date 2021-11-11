import { Token } from 'types/token';

export enum BountyStatus {
  Available = 'Available',
  InProgress = 'InProgress',
  Expired = 'Expired',
}

export interface BountyCardContent {
  id: string;
  daoId: string;
  amount: string;
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
