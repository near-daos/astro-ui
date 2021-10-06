import isEmpty from 'lodash/isEmpty';
import { useCallback, useEffect, useState } from 'react';

import { Proposal } from 'types/proposal';
import { useAuthContext } from 'context/AuthContext';
import {
  ProposalByDao,
  DaoFilterValues,
  ProposalsFilter,
  ProposalFilterValues,
  FilteredProposalsData
} from 'features/member-home/types';
import { useDaoListPerCurrentUser } from 'hooks/useDaoListPerCurrentUser';
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
          logo
        },
        proposals: [item]
      };
    }
  });

  return result;
}

function getProposalFilter(tab?: string | string[]): ProposalFilterValues {
  switch (tab) {
    case '1': {
      return 'Active proposals';
    }
    case '2': {
      return 'Recent proposals';
    }
    default: {
      return 'My proposals';
    }
  }
}

export const useFilteredMemberHomeData = (): FilteredProposalsData => {
  const router = useRouter();
  const { tab } = router.query;

  const { accountId } = useAuthContext();
  const { daos } = useDaoListPerCurrentUser();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filter, setFilter] = useState<ProposalsFilter>({
    daoFilter: 'All DAOs',
    proposalFilter: getProposalFilter(tab),
    daoViewFilter: null
  });

  const myDaos = daos?.map(item => item.id) || [];

  let selectedDaoFlag;

  const onFilterChange = useCallback(
    filterObj => {
      const [name, value] = Object.entries(filterObj)[0];

      setFilter({
        ...filter,
        [name]: value
      });
    },
    [filter]
  );

  useEffect(() => {
    async function getData() {
      if (tab) {
        const data = await SputnikService.getFilteredProposals(
          filter,
          accountId
        );

        setProposals(data);
      }
    }

    getData();
  }, [accountId, filter, tab]);

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
