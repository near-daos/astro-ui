import { DaoVotePolicy } from 'types/dao';

export const policyMock = {
  weightKind: 'RoleWeight',
  quorum: '0',
  kind: 'Ratio',
  ratio: [1, 2],
} as DaoVotePolicy;

export const groupsMock = [
  {
    members: ['alexeysputnik.testnet'],
    name: 'Everyone',
    permissions: [
      '*:VoteReject',
      '*:VoteRemove',
      '*:VoteApprove',
      '*:AddProposal',
      '*:Finalize',
    ],
    votePolicy: {},
    slug: 'Everyone',
  },
];
