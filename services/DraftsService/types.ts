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
  accountId?: string;
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

export type CreateDraftCommentData = Omit<
  DraftComment,
  'id' | 'author' | 'createdAt' | 'likeAccounts' | 'replies'
>;
