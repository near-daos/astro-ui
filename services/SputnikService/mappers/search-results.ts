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

export interface SearchResponse {
  daos: DaoDTO[];
  proposals: ProposalDTO[];
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
  };
};
