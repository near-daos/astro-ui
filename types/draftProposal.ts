import { ProposalType } from 'types/proposal';

// todo - draft version of DraftProposal :)
export interface DraftProposal {
  id: string;
  type: ProposalType;
  title: string;
  text: string;
  hashtags: string[];
  views: number;
  replies: number;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  isSaved: boolean;
  state: 'open' | 'closed';
}
