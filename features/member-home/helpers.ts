import { useCallback, useState } from 'react';
import { Proposal } from 'types/proposal';
import { useAuthContext } from 'context/AuthContext';
import {
  DaoFilter,
  FilteredProposalsData,
  ProposalByDao,
  ProposalFilter
} from 'features/member-home/types';
import { useAllProposals } from 'hooks/useAllProposals';

export const daoOptions = [
  {
    value: 'All DAOs',
    label: 'All DAOs'
  },
  {
    label: 'My DAOs',
    value: 'My DAOs'
  }
  // {
  //   label: 'Following DAOs',
  //   value: 'Following DAOs'
  // }
];

export const proposalOptions = [
  {
    label: 'Active proposals',
    value: 'Active proposals'
  },
  {
    label: 'Recent proposals',
    value: 'Recent proposals'
  },
  {
    label: 'My proposals',
    value: 'My proposals'
  }
];

export const voteByPeriod = [
  {
    title: 'less then 1 hour',
    dataKey: 'lessThanHourProposals'
  },
  {
    title: 'less than a day',
    dataKey: 'lessThanDayProposals'
  },
  {
    title: 'less than a week',
    dataKey: 'lessThanWeekProposals'
  },
  {
    title: 'more than a week',
    dataKey: 'otherProposals'
  }
];

export function arrangeByDao(proposals: Proposal[]): ProposalByDao {
  const result: ProposalByDao = {};

  proposals.forEach(item => {
    const { name, logo } = item.daoDetails;

    if (result[name]) {
      result[name].proposals.push(item);
    } else {
      result[name] = {
        dao: {
          name,
          logo
        },
        proposals: [item]
      };
    }
  });

  return result;
}

export const useFilteredMemberHomeData = (): FilteredProposalsData => {
  const proposals = useAllProposals() ?? [];
  const { accountId } = useAuthContext();
  const [filter, setFilter] = useState({
    daoFilter: 'All DAOs' as DaoFilter,
    proposalFilter: 'Active proposals' as ProposalFilter,
    daoViewFilter: null
  });
  let selectedDaoFlag;

  const onFilterChange = useCallback(
    (name, value) => {
      setFilter({
        ...filter,
        [name]: value
      });
    },
    [filter]
  );

  const filteredProposals = proposals.filter(item => {
    let matched = true;

    // Filter 'proposalFilter'
    switch (filter.proposalFilter) {
      case 'Active proposals': {
        if (item.status !== 'InProgress') {
          matched = false;
        }

        break;
      }
      case 'Recent proposals': {
        if (
          item.status !== 'Approved' &&
          item.status !== 'Rejected' &&
          item.status !== 'Expired' &&
          item.status !== 'Moved'
        ) {
          matched = false;
        }

        break;
      }
      case 'My proposals': {
        if (item.proposer !== accountId) {
          matched = false;
        }

        break;
      }
      default: {
        break;
      }
    }

    if (filter.daoViewFilter) {
      // Filter by specific dao
      if (item.daoDetails.name !== filter.daoViewFilter) {
        matched = false;
      }

      if (item.daoDetails.name === filter.daoViewFilter) {
        selectedDaoFlag = item.daoDetails.logo;
      }
    } else {
      // Filter 'daoFilter'
      switch (filter.daoFilter) {
        case 'My DAOs': {
          // todo - currntly we dont have groups info in dao inside proposal response
          break;
        }
        case 'Following DAOs': {
          // todo - how can I check if Im following this dao?
          break;
        }
        case 'All DAOs':
        default: {
          break;
        }
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
      lessThanHourProposals: arrangeByDao(lessThanHourProposals),
      lessThanDayProposals: arrangeByDao(lessThanDayProposals),
      lessThanWeekProposals: arrangeByDao(lessThanWeekProposals),
      otherProposals: arrangeByDao(otherProposals)
    },
    filter,
    onFilterChange,
    selectedDaoFlag
  };
};
