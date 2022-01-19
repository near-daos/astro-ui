import { Proposal } from 'types/proposal';

export interface BountyResponse {
  bountyId: string;
  description: string;
  times: string;
  dao: {
    id: string;
    policy: {
      bountyBond: string;
      bountyForgivenessPeriod: string;
    };
  };
  bountyClaims: BountyClaimResponse[];
  token: string;
  amount: string;
  maxDeadline: string;
  numberOfClaims: number;
}

export interface BountyClaimResponse {
  accountId: string;
  startTime: string;
  deadline: string;
  completed: boolean;
  endTime: string;
}

export interface BountiesResponse {
  data: BountyResponse[];
}

export enum BountyStatus {
  Proposed = 'Proposed',
  Available = 'Available',
  InProgress = 'InProgress',
  InProgressByMe = 'InProgressByMe',
  Expired = 'Expired',
  PendingApproval = 'PendingApproval',
  Completed = 'Completed',
}

export type ClaimedBy = {
  accountId: string;
  deadline: string;
  startTime: string;
  endTime: string;
};

export type BountyType = 'Passed' | 'Expired';
export type DeadlineUnit = 'day' | 'week' | 'month';

export type Bounty = {
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  transactionHash: string;
  updateTransactionHash: string;
  createTimestamp: string;
  updateTimestamp: string;
  bountyId: number;
  proposalId: string;
  daoId: string;
  token: string;
  times: string;
  maxDeadline: string;
  numberOfClaims: number;
  bountyClaims: BountyClaim[];
  bountyDoneProposals: Proposal[];
  id: string;
  amount: string;
  description: string;
};

export type BountyClaim = {
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  transactionHash: string;
  updateTransactionHash: string;
  createTimestamp: number;
  updateTimestamp: number;
  id: string;
  accountId: string;
  startTime: string;
  deadline: string;
  completed: boolean;
  endTime: string;
};

export type BountyContext = {
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
  daoId: string;
  proposal: Proposal;
  bounty: Bounty;
};
