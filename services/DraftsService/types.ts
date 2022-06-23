import { Hashtag } from 'types/draftProposal';
import { AuthorizedRequest, ProposalVariant } from 'types/proposal';

export type DraftBaseParams = {
  limit?: number;
  offset?: number;
  search?: string;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
};

export type DraftParams = {
  type?: string;
  state?: 'open' | 'closed';
  daoId: string;
  searchInput?: string;
  accountId: string;
  isRead?: 'true' | 'false';
  isSaved?: 'true' | 'false';
} & DraftBaseParams;

export type DraftCommentParams = {
  contextId?: string;
  contextType?: 'DraftProposal';
  isReply?: 'true' | 'false';
} & DraftBaseParams;

export type DraftComment = {
  id: string;
  contextId: string;
  contextType: 'DraftProposal';
  author: string;
  message: string;
  replyTo: string;
  replies: string[];
  likeAccounts: string[];
  createdAt: string;
};

export type CreateDraftCommentData = Omit<
  DraftComment,
  'id' | 'author' | 'createdAt' | 'likeAccounts' | 'replies'
>;

export type CreateDraftParams = {
  daoId: string;
  title: string;
  description: string;
  hashtags: Hashtag[];
  type: ProposalVariant;
  kind: Record<string, unknown>;
} & AuthorizedRequest;
