import React, { ReactNode } from 'react';
import { VoteDetail, BondDetail } from 'features/types';
import {
  ProposalType,
  ProposalStatus,
  ProposalVariant
} from 'components/cards/proposal-card/types';
import { ProposalCardProps } from 'components/cards/proposal-card';

const generatePoll = (
  status: ProposalStatus,
  likes: number,
  dislikes: number,
  liked: boolean,
  disliked: boolean,
  children: ReactNode
) => ({
  type: 'Poll' as ProposalType,
  variant: 'SuperCollapsed' as ProposalVariant,
  title: 'jonathan.near',
  status,
  likes,
  dislikes,
  liked,
  disliked,
  children,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onLike: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onDislike: () => {}
});

const generatePolls = () => {
  const polls: ProposalCardProps[] = [];
  const pollsTexts = [
    'Should we have our offsite in Madrid, Spain in 2022?',
    'We, the Meowzers fund, are committed to bringing more cats to our DAO.',
    'What do you think about renaming our DAO from Meowzers to Wowzers?',
    'Based on our discussion on Discord, I would like to open this question',
    'Do you want to create new DAO only for or grant programme?',
    'Should we hire a full-time marketing person to help us spread our message?'
  ];
  const myVotes = [false, true];

  for (let i = 1; i < 51; i += 1) {
    const likes = Math.floor(Math.random() * 300) + 1;
    const dislikes = Math.floor(Math.random() * 300) + 1;
    const status: ProposalStatus = likes >= dislikes ? 'Passed' : 'Rejected';
    const pollTextNode = React.createElement(
      'span',
      null,
      pollsTexts[likes % 6]
    );
    const liked = myVotes[likes % 2];
    const disliked = liked ? false : myVotes[dislikes % 2];
    const pollsItem: ProposalCardProps = generatePoll(
      status,
      likes,
      dislikes,
      liked,
      disliked,
      pollTextNode
    );

    polls.push(pollsItem);
  }

  return polls;
};

export const POLLS_DATA = generatePolls();

export const VOTE_DETAIL_DATA: VoteDetail[] = [
  { value: '50%', label: 'MEW holders' },
  { value: '50%', label: 'cool group' },
  { value: '1 person', label: 'Ombudspeople' }
];

export const BOND_DETAIL_DATA: BondDetail = {
  value: 0.3,
  token: 'NEAR'
};
