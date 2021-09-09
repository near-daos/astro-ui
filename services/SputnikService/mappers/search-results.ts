import {
  DaoDTO,
  mapDaoDTOListToDaoList
} from 'services/SputnikService/mappers/dao';
import { SearchResultsData } from 'types/search';
import {
  mapProposalDTOListToProposalList,
  ProposalDTO
} from 'services/SputnikService/mappers/proposal';

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

// TODO - add real mapping once Search endpoint brings real data
export const mapSearchResultsDTOToDataObject = (
  query: string,
  data: SearchResultsDTO
): SearchResultsData | null => {
  // todo - remove this line
  if (query === '') {
    return null;
  }

  return {
    query,
    daos: mapDaoDTOListToDaoList(data.daos),
    proposals: mapProposalDTOListToProposalList(data.proposals),
    members: []
    //   [
    //   {
    //     id: nanoid(),
    //     name: 'jonasteam.near',
    //     groups: ['MEW holders', 'Grants Committee', 'Ombudspeople'],
    //     tokens: {
    //       type: 'NEAR',
    //       value: 18,
    //       percent: 14
    //     },
    //     votes: 43
    //   },
    //   {
    //     id: nanoid(),
    //     name: 'jamesbond.near',
    //     groups: ['MEW holders', 'Grants Committee', 'Ombudspeople'],
    //     tokens: {
    //       type: 'NEAR',
    //       value: 11,
    //       percent: 45
    //     },
    //     votes: 23
    //   },
    //   {
    //     id: nanoid(),
    //     name: 'jasonborn.near',
    //     groups: ['MEW holders', 'Grants Committee', 'Ombudspeople'],
    //     tokens: {
    //       type: 'NEAR',
    //       value: 67,
    //       percent: 34
    //     },
    //     votes: 142
    //   },
    //   {
    //     id: nanoid(),
    //     name: 'ethanhunt.near',
    //     groups: ['MEW holders', 'Grants Committee', 'Ombudspeople'],
    //     tokens: {
    //       type: 'NEAR',
    //       value: 78,
    //       percent: 32
    //     },
    //     votes: 61
    //   }
    // ]
  };
};
