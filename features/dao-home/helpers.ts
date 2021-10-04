import { useRouter } from 'next/router';

import { DAO } from 'types/dao';
import { Proposal, ProposalsByEndTime, ProposalStatus } from 'types/proposal';

import { formatCurrency } from 'utils/formatCurrency';
import { useCallback, useEffect, useState } from 'react';
import { SputnikService } from 'services/SputnikService';
import { useAuthContext } from 'context/AuthContext';

import { splitProposalsByVotingPeriod } from 'helpers/splitProposalsByVotingPeriod';

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
  const { id, name, logo, createdAt, description, links, displayName } = dao;

  const daoDetails = {
    title: displayName || name,
    subtitle: id,
    description,
    flag: logo,
    createdAt,
    links
  };

  return daoDetails;
}

export function getProposalStats(proposals: Proposal[]): ProposalStatsType {
  return proposals.reduce(
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

export type ProposalsFilter =
  | 'Active proposals'
  | 'Recent proposals'
  | 'My proposals';

interface ProposalsData {
  filter: ProposalsFilter;
  onFilterChange: (val?: string) => void;
  filteredData: ProposalsByEndTime;
  data: Proposal[];
}

function getInitialFilter(status?: ProposalStatus) {
  if (!status || status === 'InProgress') return 'Active proposals';

  return 'Recent proposals';
}

export function useFilteredData(
  proposalStatus?: ProposalStatus
): ProposalsData {
  const router = useRouter();
  const { accountId } = useAuthContext();
  const [filter, setFilter] = useState<ProposalsFilter>(() =>
    getInitialFilter(proposalStatus)
  );
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    async function fetchProposals() {
      if (router.query.dao) {
        const daoProposals = await SputnikService.getProposals(
          router.query.dao as string
        );

        setProposals(daoProposals);
      }
    }

    fetchProposals();
  }, [router.query.dao]);

  useEffect(() => {
    if (proposalStatus) {
      setFilter(
        proposalStatus === 'InProgress'
          ? 'Active proposals'
          : 'Recent proposals'
      );
    }
  }, [proposalStatus]);

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

  const proposalsByVotingPeriod = splitProposalsByVotingPeriod(filteredData);

  return {
    filter,
    onFilterChange,
    filteredData: proposalsByVotingPeriod,
    data: proposals
  };
}
