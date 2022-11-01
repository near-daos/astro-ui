import { DaoFeedItem, Member } from 'types/dao';
import { ProposalComment, ProposalFeedItem } from 'types/proposal';
import { DraftProposalFeedItem } from 'types/draftProposal';
import { BountyContext } from 'types/bounties';
import { NftToken } from 'types/token';

export interface SearchResultsData {
  query: string;
  daos: DaoFeedItem[];
  proposals: ProposalFeedItem[];
  members: Member[];
  comments: ProposalComment[];
  drafts: DraftProposalFeedItem[];
  bounties: BountyContext[];
  nfts: NftToken[];
  totals: {
    daos: number;
    proposals: number;
    drafts: number;
    comments: number;
    nfts: number;
  };
  opts: {
    query: string;
    field?: string;
    index?: string;
  };
}
