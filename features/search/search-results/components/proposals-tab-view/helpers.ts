import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { Proposal } from 'types/proposal';

// import { arrangeByDao } from 'features/member-home';
import { FilterName } from 'features/search/search-filters';
import { Indexed, ProposalByDao } from 'features/member-home/types';
// import { splitProposalsByVotingPeriod } from 'helpers/splitProposalsByVotingPeriod';

import {
  isGovernanceProposal,
  isGroupProposal,
  isTaskProposal,
  isTreasuryProposal,
} from 'utils/proposalFilters';

export interface FilteredData extends Indexed {
  lessThanHourProposals: ProposalByDao;
  lessThanDayProposals: ProposalByDao;
  lessThanWeekProposals: ProposalByDao;
  moreThanWeekProposals: ProposalByDao;
  otherProposals: ProposalByDao;
}

type ShowFilterOption =
  | 'All'
  | 'Active Proposals'
  | 'Accepted Proposals'
  | 'Inactive Proposals'
  | 'Rejected / Expired Proposals'
  | 'Spam / Dismissed Proposals';

type SearchFilterOption = 'In this DAO' | 'In all DAOs';

interface SearchFilter {
  show: ShowFilterOption;
  search: SearchFilterOption;
  tasks: boolean;
  groups: boolean;
  treasury: boolean;
  governance: boolean;
}

export interface FilteredProposalsData {
  filteredProposalsData: FilteredData;
  filteredProposals: Proposal[];
  filter: SearchFilter;
  onFilterChange: (
    name: FilterName,
    value: string | boolean | undefined
  ) => void;
  setFilter: (value: SearchFilter) => void;
}

export const useFilteredProposalsData = (
  proposals: Proposal[],
  initialFilter?: SearchFilter
): FilteredProposalsData => {
  const router = useRouter();
  const daoId = router.query.dao;

  const [filter, setFilter] = useState(
    initialFilter || {
      show: 'All' as ShowFilterOption,
      search: 'In all DAOs' as SearchFilterOption,
      tasks: true,
      groups: true,
      treasury: true,
      governance: true,
    }
  );

  const onFilterChange = useCallback(
    (name, value) => {
      setFilter({
        ...filter,
        [name]: value,
      });
    },
    [filter]
  );

  const filteredProposals = proposals.filter(item => {
    let matched = true;

    // Filter 'show'
    switch (filter.show) {
      case 'Accepted Proposals': {
        if (item.status !== 'Approved') {
          matched = false;
        }

        break;
      }
      case 'Active Proposals': {
        if (item.status !== 'InProgress') {
          matched = false;
        }

        break;
      }
      case 'Inactive Proposals': {
        if (item.status !== 'Removed') {
          matched = false;
        }

        break;
      }
      case 'Rejected / Expired Proposals': {
        if (item.status !== 'Rejected' && item.status !== 'Expired') {
          matched = false;
        }

        break;
      }
      case 'Spam / Dismissed Proposals': {
        if (item.status !== 'Moved') {
          matched = false;
        }

        break;
      }
      case 'All':
      default: {
        break;
      }
    }

    // Filter 'search'
    switch (filter.search) {
      case 'In this DAO': {
        if (item.daoId !== daoId) {
          matched = false;
        }

        break;
      }
      case 'In all DAOs':
      default: {
        break;
      }
    }

    // Filter flags here
    if (!filter.tasks) {
      if (isTaskProposal(item)) {
        matched = false;
      }
    }

    if (!filter.governance) {
      if (isGovernanceProposal(item)) {
        matched = false;
      }
    }

    if (!filter.groups) {
      if (isGroupProposal(item)) {
        matched = false;
      }
    }

    if (!filter.treasury) {
      if (isTreasuryProposal(item)) {
        matched = false;
      }
    }

    return matched;
  });

  // const {
  //   lessThanHourProposals,
  //   lessThanDayProposals,
  //   lessThanWeekProposals,
  //   moreThanWeekProposals,
  //   otherProposals,
  // } = splitProposalsByVotingPeriod(filteredProposals);

  return {
    // filteredProposalsData: {
    //   lessThanHourProposals: arrangeByDao(lessThanHourProposals),
    //   lessThanDayProposals: arrangeByDao(lessThanDayProposals),
    //   lessThanWeekProposals: arrangeByDao(lessThanWeekProposals),
    //   moreThanWeekProposals: arrangeByDao(moreThanWeekProposals),
    //   otherProposals: arrangeByDao(otherProposals),
    // },
    filteredProposalsData: {
      lessThanHourProposals: {},
      lessThanDayProposals: {},
      lessThanWeekProposals: {},
      moreThanWeekProposals: {},
      otherProposals: {},
    },
    filteredProposals,
    filter,
    onFilterChange,
    setFilter,
  };
};
