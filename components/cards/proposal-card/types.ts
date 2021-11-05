export type ProposalType =
  | 'Add member'
  | 'Remove member'
  | 'Create group'
  | 'Request payout'
  | 'Poll'
  | 'Create bounty'
  | 'Bounty done'
  | 'Change DAO settings'
  | 'Change DAO policy'
  | 'Upgrade DAO software'
  | 'Call NEAR function';

export type ProposalStatus =
  | 'Voting in progress'
  | 'Passed'
  | 'Rejected'
  | 'Dismissed as spam'
  | 'Expired';

export type ProposalVariant = 'Default' | 'SuperCollapsed';
