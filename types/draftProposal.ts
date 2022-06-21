import { ProposalFeedItem, ProposalType } from 'types/proposal';

export type Hashtag = {
  id: string;
  value: string;
};

export type DraftComment = {
  id: string;
  likes: number;
  author: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  comments?: DraftComment[];
};

// todo - draft version of DraftProposal :)
export interface DraftProposal extends ProposalFeedItem {
  type: ProposalType;
  title: string;
  description: string;
  text: string;
  hashtags: Hashtag[];
  views: number;
  replies: number;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  isSaved: boolean;
  comments: DraftComment[];
  bookmarks: number;
  state: 'open' | 'closed';
  history: ProposalFeedItem[];
}

export interface DraftProposalFeedItem {
  id: string;
  daoId: string;
  proposer: string;
  title: string;
  type: ProposalType;
  state: 'open';
  hashtags: string[];
  replies: number;
  views: number;
  updatedAt: string;
  createdAt: string;
  isRead: boolean;
  isSaved: boolean;
}
