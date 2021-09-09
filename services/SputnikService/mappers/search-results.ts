import { DaoDTO } from 'services/SputnikService/mappers/dao';
import { Proposal } from 'types/proposal';
import { SearchResultsData } from 'types/search';
import flag from 'stories/dao-home/assets/flag.png';
import { DAO_PROPOSALS } from 'lib/mocks/dao-home';
import { nanoid } from 'nanoid';

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
  proposals: Proposal[];
  members: MemberDTO[];
}

// TODO - add real mapping once Search endpoint brings real data
export const mapSearchResultsDTOToDataObject = (
  query: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data: SearchResultsDTO
): SearchResultsData | null => {
  // todo - remove this line
  if (query === '') {
    return null;
  }

  return {
    query,
    daos: [
      {
        id: 'meowsers.sputnikdao.near',
        name: 'Meowsers',
        description:
          'We’re a community grant for artists who want to build projects on our platform. Join our Discord channel to stay up to date with latest info!',
        members: 96,
        funds: '54650.43',
        proposals: 132,
        createdAt: '2020-12-12',
        logo: (flag as unknown) as string,
        groups: [],
      }
    ],
    proposals: DAO_PROPOSALS,
    members: [
      {
        id: nanoid(),
        name: 'jonasteam.near',
        groups: ['MEW holders', 'Grants Committee', 'Ombudspeople'],
        tokens: {
          type: 'NEAR',
          value: 18,
          percent: 14
        },
        votes: 43
      },
      {
        id: nanoid(),
        name: 'jamesbond.near',
        groups: ['MEW holders', 'Grants Committee', 'Ombudspeople'],
        tokens: {
          type: 'NEAR',
          value: 11,
          percent: 45
        },
        votes: 23
      },
      {
        id: nanoid(),
        name: 'jasonborn.near',
        groups: ['MEW holders', 'Grants Committee', 'Ombudspeople'],
        tokens: {
          type: 'NEAR',
          value: 67,
          percent: 34
        },
        votes: 142
      },
      {
        id: nanoid(),
        name: 'ethanhunt.near',
        groups: ['MEW holders', 'Grants Committee', 'Ombudspeople'],
        tokens: {
          type: 'NEAR',
          value: 78,
          percent: 32
        },
        votes: 61
      }
    ]
  };
};
