import { ProposalKind } from 'types/proposal';

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
  proposalId: string;
  token: string;
  amount: string;
  maxDeadline: string;
  numberOfClaims: number;
}

export interface BountiesContextResponse {
  data: BountyContext[];
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
  InProgress = 'In Progress',
  InProgressByMe = 'In Progress By Me',
  Expired = 'Expired',
  PendingApproval = 'Pending Approval',
  Unknown = 'Unknown',
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
  bountyId: number;
  createdAt: string;
  proposalId: string;
  daoId: string;
  token: string;
  times: string;
  maxDeadline: string;
  numberOfClaims: number;
  bountyClaims: BountyClaim[];
  bountyDoneProposals: BountyProposal[];
  id: string;
  amount: string;
  description: string;
};

export type BountyClaim = {
  id: string;
  accountId: string;
  startTime: string;
  deadline: string;
  completed: boolean;
  endTime: string;
};

export type BountyContext = {
  id: string;
  daoId: string;
  proposal: BountyProposal;
  bounty: Bounty;
};

export type BountyProposal = {
  id: string;
  daoId: string;
  proposer: string;
  status: string;
  voteStatus: string;
  kind: ProposalKind;
};
