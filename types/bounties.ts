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
  amount: number;
  maxDeadline: string;
  numberOfClaims: number;
}

export interface BountyClaimResponse {
  accountId: string;
  startTime: string;
  deadline: string;
  completed: boolean;
}

export interface BountiesResponse {
  data: BountyResponse[];
}
