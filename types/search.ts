import { DaoFeedItem, Member } from 'types/dao';
import { ProposalComment, ProposalDetails } from 'types/proposal';
import { DraftProposalFeedItem } from 'types/draftProposal';

export interface SearchResultsData {
  query: string;
  daos: DaoFeedItem[];
  proposals: ProposalDetails[];
  members: Member[];
  comments: ProposalComment[];
  drafts: DraftProposalFeedItem[];
  totals: {
    daos: number;
    proposals: number;
    drafts: number;
    comments: number;
  };
}
