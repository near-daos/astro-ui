import { DaoFeedItem, Member } from 'types/dao';
import { ProposalComment, ProposalFeedItem } from 'types/proposal';
import { DraftProposalFeedItem } from 'types/draftProposal';

export interface SearchResultsData {
  query: string;
  daos: DaoFeedItem[];
  proposals: ProposalFeedItem[];
  members: Member[];
  comments?: ProposalComment[];
  drafts?: DraftProposalFeedItem[];
}
