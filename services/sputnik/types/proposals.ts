import { FeedCategories, ProposalStatuses } from 'types/proposal';

export type ProposalsQueries = {
  status?: ProposalStatuses;
  category?: FeedCategories;
};
