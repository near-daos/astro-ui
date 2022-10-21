import { ProposalKind } from 'types/proposal';
import { DaoPolicy } from 'services/sputnik/types/policy';

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
  Proposed,
  Available,
  InProgress,
  Expired,
  PendingApproval,
  Completed,
  Unknown,
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
  proposal: BountyProposal | null;
  bounty: Bounty;
  commentsCount: number;
};

export type BountyProposal = {
  id: string;
  daoId: string;
  bountyClaimId?: string;
  proposalId: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  transactionHash: string;
  votes: {
    [key: string]: 'Approve' | 'Reject' | 'Remove';
  };
  voteYes: number;
  voteNo: number;
  voteRemove: number;
  proposer: string;
  status: string;
  voteStatus: string;
  kind: ProposalKind;
  votePeriodEnd: string;
  permissions: {
    canApprove: boolean;
    canReject: boolean;
    canDelete: boolean;
    isCouncil: boolean;
  };
  dao?: {
    id: string;
    name: string;
    logo: string;
    flagCover: string;
    flagLogo: string;
    legal: {
      legalStatus?: string;
      legalLink?: string;
    };
    numberOfMembers: number;
    policy: DaoPolicy;
  };
};
