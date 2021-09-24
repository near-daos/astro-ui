import { useSearchResults } from 'features/search/search-results/SearchResults';
import { useCallback, useState } from 'react';
import { FilterName } from 'features/search/search-filters';
import { ProposalType } from 'types/proposal';
import { useRouter } from 'next/router';
import { arrangeByDao } from 'features/member-home';
import { Indexed, ProposalByDao } from 'features/member-home/types';
import { splitProposalsByVotingPeriod } from 'helpers/splitProposalsByVotingPeriod';

export interface FilteredData extends Indexed {
  lessThanHourProposals: ProposalByDao;
  lessThanDayProposals: ProposalByDao;
  lessThanWeekProposals: ProposalByDao;
  moreThanWeekProposals: ProposalByDao;
  otherProposals: ProposalByDao;
}

type ShowFilterOption =
  | 'All'
  | 'Active proposals'
  | 'Accepted proposals'
  | 'Inactive proposals'
  | 'Rejected / Dismissed / Expired';

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
  filter: SearchFilter;
  onFilterChange: (
    name: FilterName,
    value: string | boolean | undefined
  ) => void;
}

export const useFilteredProposalsData = (): FilteredProposalsData => {
  const { searchResults } = useSearchResults();
  const router = useRouter();
  const daoId = router.query.dao;
  const [filter, setFilter] = useState({
    show: 'All' as ShowFilterOption,
    search: 'In all DAOs' as SearchFilterOption,
    tasks: true,
    groups: true,
    treasury: true,
    governance: true
  });

  const onFilterChange = useCallback(
    (name, value) => {
      setFilter({
        ...filter,
        [name]: value
      });
    },
    [filter]
  );

  const proposals = searchResults?.proposals ?? [];

  const filteredProposals = proposals.filter(item => {
    let matched = true;

    // Filter 'show'
    switch (filter.show) {
      case 'Accepted proposals': {
        if (item.status !== 'Approved') {
          matched = false;
        }

        break;
      }
      case 'Active proposals': {
        if (item.status !== 'InProgress') {
          matched = false;
        }

        break;
      }
      case 'Inactive proposals': {
        if (item.status !== 'Removed') {
          matched = false;
        }

        break;
      }
      case 'Rejected / Dismissed / Expired': {
        if (
          item.status !== 'Rejected' &&
          item.status !== 'Expired' &&
          item.status !== 'Moved'
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
      if (
        item.kind.type === ProposalType.AddBounty ||
        item.kind.type === ProposalType.BountyDone ||
        item.kind.type === ProposalType.Vote ||
        item.kind.type === ProposalType.FunctionCall
      ) {
        matched = false;
      }
    }

    if (!filter.governance) {
      if (
        item.kind.type === ProposalType.ChangePolicy ||
        item.kind.type === ProposalType.UpgradeRemote ||
        item.kind.type === ProposalType.UpgradeSelf
      ) {
        matched = false;
      }
    }

    if (!filter.groups) {
      if (
        item.kind.type === ProposalType.AddMemberToRole ||
        item.kind.type === ProposalType.RemoveMemberFromRole
      ) {
        matched = false;
      }
    }

    if (!filter.treasury) {
      if (
        item.kind.type === ProposalType.SetStakingContract ||
        item.kind.type === ProposalType.Transfer
      ) {
        matched = false;
      }
    }

    return matched;
  });

  const {
    lessThanHourProposals,
    lessThanDayProposals,
    lessThanWeekProposals,
    moreThanWeekProposals,
    otherProposals
  } = splitProposalsByVotingPeriod(filteredProposals);

  return {
    filteredProposalsData: {
      lessThanHourProposals: arrangeByDao(lessThanHourProposals),
      lessThanDayProposals: arrangeByDao(lessThanDayProposals),
      lessThanWeekProposals: arrangeByDao(lessThanWeekProposals),
      moreThanWeekProposals: arrangeByDao(moreThanWeekProposals),
      otherProposals: arrangeByDao(otherProposals)
    },
    filter,
    onFilterChange
  };
};
