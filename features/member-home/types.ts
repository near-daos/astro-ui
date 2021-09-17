import { Proposal } from 'types/proposal';

export type DaoFilter = 'All DAOs' | 'My DAOs' | 'Following DAOs';
export type ProposalFilter =
  | 'Active proposals'
  | 'Recent proposals'
  | 'My proposals';

export interface ProposalByDao {
  [key: string]: Proposal[];
}

export interface Indexed {
  [key: string]: ProposalByDao;
}

export interface FilteredData extends Indexed {
  lessThanHourProposals: ProposalByDao;
  lessThanDayProposals: ProposalByDao;
  lessThanWeekProposals: ProposalByDao;
  otherProposals: ProposalByDao;
}

export type ProposalsFilter = {
  daoFilter: DaoFilter;
  proposalFilter: ProposalFilter;
  daoViewFilter: string | null;
};

export type FilteredProposalsData = {
  filteredProposalsData: FilteredData;
  filter: ProposalsFilter;
  onFilterChange: (name: string, value: string | null) => void;
};
