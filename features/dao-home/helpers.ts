import { DAO } from 'types/dao';
import { Proposal } from 'types/proposal';

import { formatCurrency } from 'utils/formatCurrency';
import { useCallback, useEffect, useState } from 'react';
import { SputnikService } from 'services/SputnikService';
import { useSelectedDAO } from 'hooks/useSelectedDao';
import { useAuthContext } from 'context/AuthContext';

export interface Indexed {
  [key: string]: Proposal[];
}

type DaoDetailsType = {
  title: string;
  subtitle: string;
  description: string;
  flag: string;
  createdAt: string;
  links: string[];
};

type ProposalStatsType = {
  activeVotes: number;
  totalProposals: number;
};

type FundMemberNumType = {
  members: number;
  fund: string;
};

export function getDaoDetailsFromDao(dao: DAO): DaoDetailsType {
  const { id, name, logo, createdAt, description } = dao;

  const daoDetails = {
    title: name,
    subtitle: id,
    description,
    flag: logo,
    createdAt,
    // TODO get links from DAO when available
    links: []
  };

  return daoDetails;
}

export function getProposalStats(proposals: Proposal[]): ProposalStatsType {
  const result = proposals.reduce(
    (acc, proposal) => {
      acc.totalProposals += 1;

      if (proposal.status === 'InProgress') {
        acc.activeVotes += 1;
      }

      return acc;
    },
    {
      activeVotes: 0,
      totalProposals: 0
    }
  );

  return result;
}

export function getFundAndMembersNum(
  dao: DAO,
  nearPrice: number
): FundMemberNumType {
  const { groups, funds } = dao;

  const membs = groups
    .map(({ members }) => members)
    .flat()
    .reduce((acc: string[], member) => {
      if (!acc.includes(member)) {
        acc.push(member);
      }

      return acc;
    }, []);

  return {
    members: membs.length,
    fund: formatCurrency(parseFloat(funds) * nearPrice)
  };
}

type ProposalsFilter = 'Active proposals' | 'Recent proposals' | 'My proposals';

export interface FilteredData extends Indexed {
  lessThanHourProposals: Proposal[];
  lessThanDayProposals: Proposal[];
  lessThanWeekProposals: Proposal[];
  otherProposals: Proposal[];
}

interface ProposalsData {
  filter: ProposalsFilter;
  onFilterChange: (val?: string) => void;
  filteredData: FilteredData;
  data: Proposal[];
}

export function splitProposalsByVotingPeriod(data: Proposal[]): FilteredData {
  return data.reduce(
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
}

export function useFilteredData(): ProposalsData {
  const selectedDao = useSelectedDAO();
  const { accountId } = useAuthContext();
  const [filter, setFilter] = useState<ProposalsFilter>('Active proposals');
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    async function fetchProposals() {
      if (selectedDao) {
        const daoProposals = await SputnikService.getProposals(selectedDao.id);

        setProposals(daoProposals);
      }
    }

    fetchProposals();
  }, [selectedDao]);

  const onFilterChange = useCallback(value => {
    setFilter(value);
  }, []);

  const filteredData = proposals.filter(item => {
    switch (filter) {
      case 'Active proposals': {
        return item.status === 'InProgress';
      }
      case 'Recent proposals': {
        return item.status !== 'InProgress';
      }
      case 'My proposals': {
        return item.proposer === accountId;
      }
      default: {
        return true;
      }
    }
  });

  const {
    lessThanHourProposals,
    lessThanDayProposals,
    lessThanWeekProposals,
    otherProposals
  } = splitProposalsByVotingPeriod(filteredData);

  return {
    filter,
    onFilterChange,
    filteredData: {
      lessThanHourProposals,
      lessThanDayProposals,
      lessThanWeekProposals,
      otherProposals
    },
    data: proposals
  };
}
