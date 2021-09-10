import { DAO } from 'types/dao';
import { Proposal } from 'types/proposal';

import { formatCurrency } from 'utils/formatCurrency';

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
