import { ProposalKind, ProposalType, ProposalVariant } from 'types/proposal';
import { Authorization } from 'types/auth';

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
  replyTo: string | undefined;
  replies: DraftComment[];
  likeAccounts: string[];
  createdAt: string;
};

export type EditDraftCommentData = Omit<
  DraftComment,
  | 'contextId'
  | 'contextType'
  | 'author'
  | 'createdAt'
  | 'likeAccounts'
  | 'replies'
  | 'replyTo'
>;

export type CreateDraftCommentData = Omit<
  DraftComment,
  'id' | 'author' | 'createdAt' | 'likeAccounts' | 'replies'
>;

export type DraftKind = { proposalVariant: ProposalVariant } & Record<
  string,
  unknown
>;

export type CreateDraftParams = {
  daoId: string;
  title: string;
  description: string;
  hashtags: string[];
  type: ProposalType;
  kind?: DraftKind | ProposalKind;
} & Authorization;

export type DraftIdParams = {
  id: string;
} & Authorization;
