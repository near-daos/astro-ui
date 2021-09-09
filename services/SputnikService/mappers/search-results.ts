import { nanoid } from 'nanoid';
import {
  DaoDTO,
  mapDaoDTOListToDaoList
} from 'services/SputnikService/mappers/dao';
import { SearchResultsData } from 'types/search';
import {
  mapProposalDTOListToProposalList,
  ProposalDTO
} from 'services/SputnikService/mappers/proposal';
import { DAO, Member } from 'types/dao';

type MemberDTO = {
  id: string;
  name: string;
  groups: string[];
  tokens: {
    type: string;
    value: number;
    percent: number;
  };
  votes: number;
};

export interface SearchResultsDTO {
  daos: DaoDTO[];
  proposals: ProposalDTO[];
  members: MemberDTO[];
}

export interface SearchResponse {
  daos: DaoDTO[];
  proposals: ProposalDTO[];
}

export const extractMembersFromDaosList = (daos: DAO[]): Member[] => {
  const members = {} as Record<string, Member>;

  daos.forEach(dao => {
    dao.groups.forEach(grp => {
      const users = grp.members;

      users.forEach(user => {
        if (!members[user]) {
          members[user] = {
            id: nanoid(),
            name: user,
            groups: [grp.name],
            tokens: {
              type: 'NEAR',
              value: 18,
              percent: 14
            },
            votes: 12
          };
        } else {
          members[user] = {
            ...members[user],
            groups: [...members[user].groups, grp.name]
          };
        }
      });
    });
  });

  return Object.values(members).map(item => {
    return {
      ...item,
      groups: Array.from(new Set(item.groups))
    };
  });
};

export const mapSearchResultsDTOToDataObject = (
  query: string,
  data: SearchResultsDTO
): SearchResultsData | null => {
  if (query === '') {
    return null;
  }

  const daos = mapDaoDTOListToDaoList(data.daos);
  const members = extractMembersFromDaosList(daos);
  const proposals = mapProposalDTOListToProposalList(data.proposals);

  return {
    query,
    daos,
    proposals,
    members
  };
};
