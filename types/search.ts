import { DAO, Member } from 'types/dao';
import { Proposal } from 'types/proposal';

export interface SearchResultsData {
  query: string;
  daos: DAO[];
  proposals: Proposal[];
  members: Member[];
}
