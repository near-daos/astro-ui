import { VotePolicy } from 'features/vote-policy/components/policy-row';

export const createBounty = {
  proposers: ['MEW holders', 'NEAR holders'],
  policies: [
    {
      whoCanVote: 'MEW holders',
      voteBy: 'Person',
      amount: 50,
      threshold: '% of group',
    } as VotePolicy,
    {
      whoCanVote: 'NEAR holders',
      voteBy: 'Person',
      amount: 5,
      threshold: 'persons',
    } as VotePolicy,
  ],
};

export const closeBounty = {
  proposers: ['MEW holders', 'NEAR holders'],
  policies: [
    {
      whoCanVote: 'MEW holders',
      voteBy: 'Person',
      amount: 50,
      threshold: '% of group',
    } as VotePolicy,
    {
      whoCanVote: 'NEAR holders',
      voteBy: 'Person',
      amount: 5,
      threshold: 'persons',
    } as VotePolicy,
  ],
};

export const createPoll = {
  proposers: ['MEW holders', 'NEAR holders'],
  policies: [
    {
      whoCanVote: 'MEW holders',
      voteBy: 'Person',
      amount: 50,
      threshold: '% of group',
    } as VotePolicy,
    {
      whoCanVote: 'NEAR holders',
      voteBy: 'Person',
      amount: 5,
      threshold: 'persons',
    } as VotePolicy,
  ],
};

export const nearFunction = {
  proposers: ['MEW holders', 'NEAR holders'],
  policies: [
    {
      whoCanVote: 'MEW holders',
      voteBy: 'Person',
      amount: 50,
      threshold: '% of group',
    } as VotePolicy,
    {
      whoCanVote: 'NEAR holders',
      voteBy: 'Person',
      amount: 5,
      threshold: 'persons',
    } as VotePolicy,
  ],
};
