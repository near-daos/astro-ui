import isEmpty from 'lodash/isEmpty';
import { useCallback, useEffect, useState } from 'react';

import { Proposal } from 'types/proposal';
import { useAuthContext } from 'context/AuthContext';
import {
  FilteredProposalsData,
  ProposalByDao,
  DaoFilterValues,
  ProposalFilterValues
} from 'features/member-home/types';
import { splitProposalsByVotingPeriod } from 'helpers/splitProposalsByVotingPeriod';

import { SputnikService } from 'services/SputnikService';
import { useRouter } from 'next/router';

export const daoOptions: { value: DaoFilterValues; label: string }[] = [
  {
    value: 'All DAOs',
    label: 'All DAOs'
  },
  {
    label: 'My DAOs',
    value: 'My DAOs'
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
          logo,
          id: item.daoId
        },
        proposals: [item]
      };
    }
  });

  return result;
}

export function getProposalFilter(
  tab?: string | string[]
): ProposalFilterValues {
  switch (tab) {
    case '1': {
      return 'Active proposals' as ProposalFilterValues;
    }
    case '2': {
      return 'Recent proposals' as ProposalFilterValues;
    }
    default: {
      return 'My proposals' as ProposalFilterValues;
    }
  }
}

export const useFilteredMemberHomeData = (
  proposals: Proposal[]
): FilteredProposalsData => {
  const router = useRouter();
  const { tab, daoFilter, daoViewFilter } = router.query;
  const filter = {
    daoFilter: daoFilter ? (daoFilter as DaoFilterValues) : 'All DAOs',
    proposalFilter: getProposalFilter(tab),
    daoViewFilter: daoViewFilter ? (daoViewFilter as string) : null
  };
  let selectedDaoFlag;

  const onFilterChange = useCallback(
    filterObj => {
      const [name, value] = Object.entries(filterObj)[0];

      if (name !== 'tab' && name !== 'proposalFilter') {
        router.push({
          pathname: '',
          query: {
            ...router.query,
            [name]: value as string
          }
        });
      }
    },
    [router]
  );

  if (filter.daoViewFilter) {
    proposals.forEach(item => {
      if (item.daoDetails.name === filter.daoViewFilter) {
        selectedDaoFlag = item.daoDetails.logo;
      }
    });
  }

  const {
    lessThanHourProposals,
    lessThanDayProposals,
    lessThanWeekProposals,
    moreThanWeekProposals,
    otherProposals
  } = splitProposalsByVotingPeriod(proposals);

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
