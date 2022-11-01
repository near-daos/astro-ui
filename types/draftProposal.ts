import { ProposalFeedItem, ProposalType } from 'types/proposal';

export enum DraftStatus {
  Open = 'open',
  Closed = 'closed',
}

export type DraftComment = {
  id: string;
  likes: number;
  author: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  comments?: DraftComment[];
};

export interface DraftProposal extends ProposalFeedItem {
  type: ProposalType;
  title: string;
  description: string;
  text: string;
  views: number;
  replies: number;
  saves: number;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  isSaved: boolean;
  state: 'open' | 'closed';
  history: ProposalFeedItem[];
}

export interface DraftProposalFeedItem {
  id: string;
  daoId: string;
  proposer: string;
  title: string;
  type: ProposalType;
  state: 'open' | 'closed';
  proposalId?: number;
  replies: number;
  views: number;
  updatedAt: string;
  createdAt: string;
  isRead: boolean;
  isSaved: boolean;
  viewAccounts?: string[];
}
