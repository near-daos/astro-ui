import { BountyCardContent } from 'astro_2.0/components/BountyCard/types';

export const daoMock = {
  legal: {},
  id: 'myDaoId',
  txHash: '4px581fv2HJ5LuWBUs72qouAJnZ5ka4bEA2ZLmixgjHD',
  name: 'saturn',
  description:
    'We’re a community grant for artists who want to build projects on our platform. Join our Discord channel to stay up to date with latest info!',
  members: 3,
  daoMembersList: ['jason.born'],
  activeProposalsCount: 11,
  totalProposalsCount: 15,
  totalDaoFunds: 77,
  lastProposalId: 12,
  proposals: 13,
  totalProposals: 15,
  logo:
    'https://image.freepik.com/free-photo/blue-liquid-marble-background-abstract-flowing-texture-experimental-art_53876-104502.jpg',
  funds: '17043.60259',
  createdAt: '2021-10-22T12:46:32.885Z',
  groups: [
    {
      members: ['anima.testnet'],
      name: 'Council',
      permissions: [
        '*:Finalize',
        '*:AddProposal',
        '*:VoteApprove',
        '*:VoteReject',
        '*:VoteRemove',
      ],
      votePolicy: {},
      slug: 'Council',
    },
  ],
  policy: {
    createdAt: '2021-10-22T12:46:32.885Z',
    daoId: 'saturn.sputnikv2.testnet',
    proposalBond: '100000000000000000000000',
    bountyBond: '100000000000000000000000',
    proposalPeriod: '604800000000000',
    bountyForgivenessPeriod: '604800000000000',
    defaultVotePolicy: {
      weightKind: 'RoleWeight',
      quorum: '0',
      kind: 'Ratio',
      weight: '',
      ratio: [3, 10],
    },
    roles: [],
  },
  links: ['example.com'],
  displayName: 'Saturn',
};

export const contentMock = ({
  id: 3,
  daoId: 'kaleinik-token-test.sputnikv2.testnet',
  amount: '100',
  description: 'DIY',
  externalUrl: '',
  forgivenessPeriod: '604800000000000',
  bountyBond: '100000000000000000000000',
  status: 'Available',
  type: 'Bounty',
  timeToComplete: 'in 4 days',
  slots: 1,
  slotsTotal: 1,
  claimedByCurrentUser: false,
} as unknown) as BountyCardContent;
