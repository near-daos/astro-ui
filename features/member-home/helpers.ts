import isEmpty from 'lodash/isEmpty';
import { useCallback, useEffect, useState } from 'react';

import { Proposal } from 'types/proposal';
import { useAuthContext } from 'context/AuthContext';
import {
  DaoFilter,
  FilteredProposalsData,
  ProposalByDao,
  ProposalFilter
} from 'features/member-home/types';
import { useAllProposals } from 'hooks/useAllProposals';
import { useDaoListPerCurrentUser } from 'hooks/useDaoListPerCurrentUser';
import { splitProposalsByVotingPeriod } from 'helpers/splitProposalsByVotingPeriod';

import { SputnikService } from 'services/SputnikService';

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
  const { daos } = useDaoListPerCurrentUser();
  const myDaos = daos?.map(item => item.id) || [];
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
          if (!myDaos.includes(item.daoId)) {
            matched = false;
          }

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
    onFilterChange,
    selectedDaoFlag
  };
};

export function useUserHasProposals(): boolean {
  const { accountId } = useAuthContext();
  const [hasProposals, setHasProposals] = useState(false);

  useEffect(() => {
    async function checkIfHasProposals() {
      if (accountId) {
        const proposals = await SputnikService.getUserProposals(accountId);

        setHasProposals(!isEmpty(proposals));
      }
    }

    checkIfHasProposals();
  }, [accountId]);

  return hasProposals;
}
