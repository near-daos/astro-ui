import { nanoid } from 'nanoid';

import { DAO, DaoFeedItem, Member } from 'types/dao';
import { ProposalFeedItem } from 'types/proposal';
import { SearchResultsData } from 'types/search';
import { DaoPermission } from 'types/role';

import {
  DaoFeedItemResponse,
  mapDaoFeedItemResponseToDaoFeedItemList,
  MemberStats,
} from './dao';
import {
  mapProposalFeedItemResponseToProposalFeedItem,
  ProposalFeedItemResponse,
} from './proposal';

type MemberDTO = {
  accountId: string;
  roles: {
    daoId: string;
    kind: 'Everyone' | 'Group';
    name: string;
    permissions: DaoPermission[];
  }[];
  voteCount: number;
};

export interface SearchResultsDTO {
  daos: DaoFeedItemResponse[];
  proposals: ProposalFeedItemResponse[];
  members: MemberDTO[];
}

export interface SearchResponse {
  daos: {
    data: DaoFeedItemResponse[];
  };
  proposals: {
    data: ProposalFeedItemResponse[];
  };
}

export const extractMembersFromDaosList = (
  daos: DaoFeedItem[],
  proposals: ProposalFeedItem[],
  query: string
): Member[] => {
  const members = {} as Record<string, Member>;

  const votesPerProposer = proposals.reduce((acc, currentProposal) => {
    const vote = currentProposal.votes[currentProposal.proposer];

    if (vote) {
      if (acc[currentProposal.proposer]) {
        acc[currentProposal.proposer] += 1;
      } else {
        acc[currentProposal.proposer] = 1;
      }
    }

    return acc;
  }, {} as Record<string, number>);

  daos.forEach(dao => {
    dao.policy.roles.forEach(grp => {
      const users = grp.accountIds;

      if (!users) {
        return;
      }

      users.forEach(user => {
        if (!members[user]) {
          members[user] = {
            id: nanoid(),
            name: user,
            groups: [grp.name],
            tokens: {
              symbol: 'NEAR',
              value: 18,
            },
            votes: votesPerProposer[user],
          };
        } else {
          members[user] = {
            ...members[user],
            groups: [...members[user].groups, grp.name],
          };
        }
      });
    });
  });

  return Object.values(members)
    .map(item => {
      return {
        ...item,
        groups: Array.from(new Set(item.groups)),
      };
    })
    .filter(item => {
      return item.name && item.name.includes(query);
    });
};

export const extractMembersFromDao = (
  dao: DAO,
  membersStats: MemberStats[]
): Member[] => {
  const votesPerProposer = membersStats.reduce<Record<string, number>>(
    (res, item) => {
      res[item.accountId] = item.voteCount;

      return res;
    },
    {}
  );

  const members = {} as Record<string, Member>;

  dao.groups.forEach(grp => {
    const users = grp.members;

    users.forEach(user => {
      if (!members[user]) {
        members[user] = {
          id: nanoid(),
          name: user,
          groups: [grp.name],
          // TODO - tokens are now hidden in UI
          tokens: {
            symbol: 'NEAR',
            value: 18,
          },
          votes: votesPerProposer[user] ?? null,
        };
      } else {
        members[user] = {
          ...members[user],
          groups: [...members[user].groups, grp.name],
        };
      }
    });
  });

  return Object.values(members).map(item => {
    return {
      ...item,
      groups: Array.from(new Set(item.groups)),
    };
  });
};

function mapMemberDTOToMember(item: MemberDTO): Member {
  return {
    id: item.accountId,
    name: item.accountId,
    votes: item.voteCount,
    groups: item.roles.map(role => role.name),
  };
}

export const mapSearchResultsDTOToDataObject = (
  query: string,
  data: SearchResultsDTO
): SearchResultsData | null => {
  if (query === '') {
    return null;
  }

  const daosResults = data.daos ?? [];
  const proposalsResults = data.proposals ?? [];
  const membersResults = data.members ?? [];

  const daos = mapDaoFeedItemResponseToDaoFeedItemList(daosResults);
  const proposals = proposalsResults.map(
    mapProposalFeedItemResponseToProposalFeedItem
  );
  const members = membersResults.map(mapMemberDTOToMember);

  return {
    query,
    daos,
    proposals,
    members,
    bounties: [],
    comments: [],
    drafts: [],
    nfts: [],
    draftProposalComments: [],
    totals: {
      daos: daos.length,
      proposals: proposals.length,
      comments: 0,
      drafts: 0,
      nfts: 0,
      draftProposalComments: 0,
    },
    opts: {
      query,
    },
  };
};
