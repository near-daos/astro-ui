import { DaoFeedItem, Member } from 'types/dao';
import { ProposalFeedItem } from 'types/proposal';

export interface SearchResultsData {
  query: string;
  daos: DaoFeedItem[];
  proposals: ProposalFeedItem[];
  members: Member[];
}
