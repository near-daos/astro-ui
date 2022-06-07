import { ProposalCategories } from 'types/proposal';

export const FEED_CATEGORIES = [
  { value: ProposalCategories.Governance, label: 'Governance' },
  { value: ProposalCategories.Financial, label: 'Financial' },
  { value: ProposalCategories.Bounties, label: 'Bounties' },
  { value: ProposalCategories.Members, label: 'Members' },
  { value: ProposalCategories.Polls, label: 'Polls' },
  { value: ProposalCategories.FunctionCalls, label: 'Function Calls' },
];

export const STAKING_CONTRACT_PREFIX = '-staking';
