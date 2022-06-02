import { ProposalFeedItem, ProposalType } from 'types/proposal';

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
  hashtags: string[];
  views: number;
  replies: number;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  isSaved: boolean;
  comments: DraftComment[];
  bookmarks: number;
  state: 'open' | 'closed';
}
