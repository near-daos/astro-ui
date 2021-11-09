import { ProposalCategories, ProposalStatuses } from 'types/proposal';

export type ProposalsQueries = {
  status?: ProposalStatuses;
  category?: ProposalCategories;
};
