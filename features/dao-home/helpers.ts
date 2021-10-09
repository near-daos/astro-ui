import { useRouter } from 'next/router';

import { DAO } from 'types/dao';
import { Proposal } from 'types/proposal';

import { formatCurrency } from 'utils/formatCurrency';
import { useEffect, useState } from 'react';
import { SputnikService } from 'services/SputnikService';

import { Option } from 'components/dropdown/Dropdown';

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
  data: Proposal[];
}

export function useProposalsData(): ProposalsData {
  const router = useRouter();
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

  return {
    data: proposals
  };
}

export function filterProposalsByStatus(proposals: Proposal[]): Proposal[][] {
  return proposals.reduce(
    (res, item) => {
      switch (item.status) {
        case 'InProgress': {
          res[0].push(item);
          break;
        }
        case 'Approved': {
          res[1].push(item);
          break;
        }
        default: {
          res[2].push(item);
        }
      }

      return res;
    },
    [[] as Proposal[], [] as Proposal[], [] as Proposal[]]
  );
}

export function getProposalsFilterOptions(
  accountId?: string
): Option<string>[] {
  const options = [
    {
      label: 'Active proposals',
      value: 'Active proposals'
    },
    {
      label: 'Recent proposals',
      value: 'Recent proposals'
    }
  ];

  if (accountId) {
    options.push({
      label: 'My proposals',
      value: 'My proposals'
    });
  }

  return options;
}
