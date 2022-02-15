import { Proposal } from 'types/proposal';

export type DaoFilterValues = 'All DAOs' | 'My DAOs' | 'Following DAOs';
export type ProposalFilterValues =
  | 'Active proposals'
  | 'Recent proposals'
  | 'My proposals';

export type ProposalFilterOptions =
  | 'Polls'
  | 'Governance'
  | 'Financial'
  | 'Bounties'
  | 'Groups'
  | null;

export type ProposalFilterStatusOptions =
  | 'All'
  | 'Active proposals'
  | 'Approved'
  | 'Failed'
  | null;

export type DaoProposal = {
  dao: {
    id: string;
    name: string;
    displayName: string;
    logo: string;
  };
  proposals: Proposal[];
};

export interface ProposalByDao {
  [key: string]: DaoProposal;
}

export interface Indexed {
  [key: string]: ProposalByDao;
}

export interface DaoFilter {
  daoFilter: DaoFilterValues;
}

export interface ProposalFilter {
  proposalFilter: ProposalFilterValues;
}

export interface DaoViewFilter {
  daoViewFilter: string | null;
}

export interface FilteredData extends Indexed {
  lessThanHourProposals: ProposalByDao;
  lessThanDayProposals: ProposalByDao;
  lessThanWeekProposals: ProposalByDao;
  moreThanWeekProposals: ProposalByDao;
  otherProposals: ProposalByDao;
}

export type ProposalsFilter = DaoFilter & ProposalFilter & DaoViewFilter;

export type FilteredProposalsData = {
  filteredProposalsData: FilteredData;
  filter: ProposalsFilter;
  onFilterChange: (filter: DaoFilter | ProposalFilter | DaoViewFilter) => void;
  selectedDaoFlag?: string;
};
