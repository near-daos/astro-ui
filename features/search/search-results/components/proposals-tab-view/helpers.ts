import { useSearchResults } from 'features/search/search-results/SearchResults';
import { useCallback, useState } from 'react';
import { FilterName } from 'features/search/search-filters';
import { Proposal, ProposalType } from 'types/proposal';
import { useRouter } from 'next/router';

export interface Indexed {
  [key: string]: Proposal[];
}

export interface FilteredData extends Indexed {
  lessThanHourProposals: Proposal[];
  lessThanDayProposals: Proposal[];
  lessThanWeekProposals: Proposal[];
  otherProposals: Proposal[];
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
    search: 'In this DAO' as SearchFilterOption,
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
    otherProposals
  } = filteredProposals.reduce(
    (res, item) => {
      // Split items by groups (less than hour, day, week)
      const votingEndsAt = new Date(item.votePeriodEnd).getMilliseconds();
      const now = new Date().getMilliseconds();
      const diff = votingEndsAt - now;

      if (diff < 3.6e6) {
        res.lessThanHourProposals.push(item);
      } else if (diff < 8.64e7) {
        res.lessThanDayProposals.push(item);
      } else if (diff < 6.048e8) {
        res.lessThanWeekProposals.push(item);
      } else {
        res.otherProposals.push(item);
      }

      return res;
    },
    {
      lessThanHourProposals: [] as Proposal[],
      lessThanDayProposals: [] as Proposal[],
      lessThanWeekProposals: [] as Proposal[],
      otherProposals: [] as Proposal[]
    }
  );

  return {
    filteredProposalsData: {
      lessThanHourProposals,
      lessThanDayProposals,
      lessThanWeekProposals,
      otherProposals
    },
    filter,
    onFilterChange
  };
};
