export type TimelineMilestoneType =
  | 'Proposal Created'
  | 'Bounty Created'
  | 'Claim'
  | 'Pending Approval'
  | 'Complete Claim'
  | 'Claim Deadline'
  | 'Complete Bounty';

export type TimelineMilestone = {
  type: TimelineMilestoneType;
  date: Date;
  tooltip: string;
  color?: string;
};

export type TimelineClaim = {
  id: string;
  milestones: TimelineMilestone[];
  title: string;
  color: string;
  minDate?: Date;
  maxDate?: Date;
};

export type TimelineGroup = {
  id: string;
  name: string;
  isOpen: boolean;
  milestones: TimelineMilestone[];
  claims: TimelineClaim[];
  minDate?: Date;
  maxDate?: Date;
};

export type TimelineGranularity = 'month' | 'day' | 'hour';
