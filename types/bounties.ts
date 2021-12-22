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
  Available = 'Available',
  InProgress = 'InProgress',
  InProgressByMe = 'InProgressByMe',
  Expired = 'Expired',
  PendingApproval = 'PendingApproval',
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
  id: string;
  tokenId: string;
  amount: string;
  description: string;
  forgivenessPeriod: string;
  externalUrl?: string;
  slots: number;
  slotsTotal: number;
  claimedBy: ClaimedBy[];
  deadlineThreshold: string;
  completionDate?: string;
};
