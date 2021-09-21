export type ClaimedBy = {
  accountId: string;
  deadline: string;
  starTime: string;
};

export type BountyType = 'Passed' | 'Expired';
export type BountyStatus = 'Open' | 'In progress' | 'Completed';
export type DeadlineUnit = 'day' | 'week' | 'month';

export type Bounty = {
  id: string;
  token: 'NEAR';
  amount: number;
  description: string;
  forgivenessPeriod: string;
  externalUrl?: string;
  slots: number;
  claimedBy: ClaimedBy[];
  deadlineThreshold: string;
  completionDate?: string;
};
