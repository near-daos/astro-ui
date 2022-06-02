import { ProposalType } from 'types/proposal';
import { DraftComment, DraftProposal } from 'types/draftProposal';

const proposal = {
  voteYes: 0,
  voteNo: 0,
  voteRemove: 0,
  votes: {},
  id: 'test.sputnikv2.testnet-6',
  proposalId: 6,
  daoId: 'test.sputnikv2.testnet',
  proposer: 'terratest.testnet',
  commentsCount: 0,
  description:
    'create multicall instance for this DAO at test.v1_02.multicall.testnet',
  link: '',
  status: 'InProgress',
  kind: {
    type: 'FunctionCall',
    receiverId: 'v1_02.multicall.testnet',
    actions: [
      {
        methodName: 'create',
        args:
          'eyJtdWx0aWNhbGxfaW5pdF9hcmdzIjp7ImFkbWluX2FjY291bnRzIjpbInRlc3Quc3B1dG5pa3YyLnRlc3RuZXQiXSwiY3JvbmNhdF9tYW5hZ2VyIjoibWFuYWdlcl92MS5jcm9uY2F0LnRlc3RuZXQiLCJqb2JfYm9uZCI6IjEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAifX0=',
        deposit: '1000000000000000000000000',
        gas: '150000000000000',
      },
    ],
  },
  votePeriodEnd: '2022-06-03T02:21:05.837Z',
  votePeriodEndDate: '2022-06-03T02:21:05.837Z',
  voteStatus: 'Active',
  isFinalized: false,
  txHash: '6CfB5TM3iS9nQNAusXsqSSKhK2r9t3jfiKD4eRyHbiPr',
  createdAt: '2022-05-27T02:21:17.140Z',
  dao: {
    id: 'test.sputnikv2.testnet',
    name: 'test',
    logo: '/flags/defaultDaoFlag.png',
    flagCover: '',
    flagLogo: '',
    legal: {},
    numberOfMembers: 2,
    policy: {
      daoId: 'test.sputnikv2.testnet',
      defaultVotePolicy: {
        weightKind: 'RoleWeight',
        quorum: '0',
        kind: 'Ratio',
        ratio: [1, 2],
      },
    },
  },
  daoDetails: {
    name: 'test',
    displayName: '',
    logo: '/flags/defaultDaoFlag.png',
  },
  proposalVariant: 'ProposeDefault',
  updatedAt: '2022-05-27T02:21:17.140Z',
  actions: [
    {
      id: 'test.sputnikv2.testnet-6-terratest.testnet-AddProposal',
      proposalId: 'test.sputnikv2.testnet-6',
      accountId: 'terratest.testnet',
      action: 'AddProposal',
      transactionHash: '6CfB5TM3iS9nQNAusXsqSSKhK2r9t3jfiKD4eRyHbiPr',
      timestamp: '1653618065837431071',
    },
  ],
  permissions: {
    isCouncil: false,
    canApprove: false,
    canReject: false,
    canDelete: false,
  },
};

const comment: DraftComment = {
  createdAt: '2021-12-26T20:30:46.036Z',
  updatedAt: '2021-12-26T20:30:46.036Z',
  id: '0',
  likes: 10,
  author: 'John Doe',
  description: '<p>Test</p>',
};

export const mocks = {
  count: 2,
  total: 2,
  page: 0,
  pageCount: 1,
  data: [
    {
      ...proposal,
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
      bookmarks: 10,
      comments: [comment],
      state: 'open',
    },
    {
      ...proposal,
      id: '1',
      type: ProposalType.FunctionCall,
      title: 'Some title',
      text: 'some desc here',
      hashtags: ['#mintbase', '#community', '#marketing'],
      views: 0,
      replies: 0,
      isRead: false,
      isSaved: false,
      bookmarks: 10,
      comments: [comment],
      state: 'open',
    },
  ] as DraftProposal[],
};
