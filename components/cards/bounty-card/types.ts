export type ClaimedBy = {
  name: string;
  datetime: string;
};

export type BountyType = 'Passed' | 'Expired';
export type DeadlineUnit = 'day' | 'week' | 'month';

export type Bounty = {
  type: BountyType; // icon/color todo - do we have one icon only? colors?
  status: 'Open' | 'In progress' | 'Completed';
  token: 'NEAR';
  amount: number;
  group: string;
  externalUrl?: string;
  slots: number;
  claimed: number;
  claimedBy: ClaimedBy[];
  claimedByMe: boolean;
  deadlineThreshold: number;
  deadlineUnit: DeadlineUnit;
};
