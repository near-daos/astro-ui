import { useSearchResults } from 'features/search/search-results/SearchResults';
import { useCallback, useState } from 'react';
import { FilterName } from 'features/search/search-filters';
import { Proposal } from 'types/proposal';

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

  const filteredProposals = proposals.filter(() => {
    const matched = true;

    // Filter 'show'
    switch (filter.show) {
      case 'Accepted proposals': {
        // todo - check if accepted proposal. What is it?
        break;
      }
      case 'Active proposals': {
        // todo - check if active proposal. What is it?
        break;
      }
      case 'Inactive proposals': {
        // todo - check if inactive proposal. What is it?
        break;
      }
      case 'Rejected / Dismissed / Expired': {
        break;
      }
      case 'All':
      default: {
        break;
      }
    }

    // TODO - how can we get currently selected DAO? It looks like we need a way to keep some data for the whole app
    // Filter 'search'
    switch (filter.search) {
      case 'In this DAO': {
        break;
      }
      case 'In all DAOs':
      default: {
        break;
      }
    }

    // Filter flags here
    if (filter.tasks) {
      // TODO - how can we check if specific item relates to tasks, groups etc.?
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
