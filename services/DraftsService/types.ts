import { ProposalKind, ProposalType, ProposalVariant } from 'types/proposal';
import { Authorization } from 'types/auth';

export type DraftBaseParams = {
  limit?: number;
  offset?: number;
  search?: string;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
};

export type DraftState = 'open' | 'closed' | 'all';

export type DraftParams = {
  type?: string;
  state?: DraftState;
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
  dislikeAccounts: string[];
  createdAt: string;
  updatedAt: string;
};

export type EditDraftCommentData = Omit<
  DraftComment,
  | 'contextId'
  | 'contextType'
  | 'author'
  | 'createdAt'
  | 'updatedAt'
  | 'likeAccounts'
  | 'dislikeAccounts'
  | 'replies'
  | 'replyTo'
>;

export type CreateDraftCommentData = Omit<
  DraftComment,
  | 'id'
  | 'author'
  | 'createdAt'
  | 'updatedAt'
  | 'likeAccounts'
  | 'dislikeAccounts'
  | 'replies'
>;

export type DraftKind = { proposalVariant: ProposalVariant } & Record<
  string,
  unknown
>;

export type CreateDraftParams = {
  daoId: string;
  title: string;
  description: string;
  type: ProposalType;
  kind?: DraftKind | ProposalKind;
} & Authorization;

export type DraftIdParams = {
  id: string;
} & Authorization;
