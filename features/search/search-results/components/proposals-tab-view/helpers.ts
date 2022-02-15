import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { ProposalFeedItem } from 'types/proposal';

import { Indexed, ProposalByDao } from 'types/memberHome';

import {
  isGovernanceProposal,
  isGroupProposal,
  isTaskProposal,
  isTreasuryProposal,
} from 'utils/proposalFilters';

import { FilterName } from './types';

export interface FilteredData extends Indexed {
  lessThanHourProposals: ProposalByDao;
  lessThanDayProposals: ProposalByDao;
  lessThanWeekProposals: ProposalByDao;
  moreThanWeekProposals: ProposalByDao;
  otherProposals: ProposalByDao;
}

type ShowFilterOption = 'All' | 'Active' | 'Approved' | 'Failed';

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
  filteredProposals: ProposalFeedItem[];
  filter: SearchFilter;
  onFilterChange: (
    name: FilterName,
    value: string | boolean | undefined
  ) => void;
  setFilter: (value: SearchFilter) => void;
}

export const useFilteredProposalsData = (
  proposals: ProposalFeedItem[],
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
      case 'Approved': {
        if (item.status !== 'Approved') {
          matched = false;
        }

        break;
      }
      case 'Active': {
        if (item.status !== 'InProgress') {
          matched = false;
        }

        break;
      }
      case 'Failed': {
        if (
          item.status !== 'Removed' &&
          item.status !== 'Rejected' &&
          item.status !== 'Expired'
        ) {
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
