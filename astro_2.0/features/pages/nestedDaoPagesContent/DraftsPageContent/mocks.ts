import { ProposalType } from 'types/proposal';
import { DraftProposal } from 'types/draftProposal';

export const mocks = {
  count: 2,
  total: 2,
  page: 0,
  pageCount: 1,
  data: [
    {
      id: '0',
      type: ProposalType.Transfer,
      title: 'Draft Name kickstart medical outreaches by near medical',
      text: 'some desc here',
      hashtags: ['#mintbase', '#community', '#marketing'],
      views: 0,
      replies: 0,
      createdAt: '2021-12-26T20:30:46.036Z',
      updatedAt: '2021-12-26T20:30:46.036Z',
      isRead: false,
      isSaved: false,
      state: 'open',
    },
    {
      id: '1',
      type: ProposalType.FunctionCall,
      title: 'Some title',
      text: 'some desc here',
      hashtags: ['#mintbase', '#community', '#marketing'],
      views: 0,
      replies: 0,
      createdAt: '2021-12-26T20:30:46.036Z',
      updatedAt: '2021-12-26T20:30:46.036Z',
      isRead: false,
      isSaved: false,
      state: 'open',
    },
  ] as DraftProposal[],
};
