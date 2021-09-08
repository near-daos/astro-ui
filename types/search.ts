import { DAO, Member } from 'types/dao';
import { ProposalCardProps } from 'components/cards/proposal-card';

export interface SearchResultsData {
  query: string;
  daos: DAO[];
  proposals: ProposalCardProps[];
  members: Member[];
}
