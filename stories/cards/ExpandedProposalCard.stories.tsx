import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  ExpandedProposalCard,
  ExpandedProposalCardProps
} from 'components/cards/expanded-proposal-card';
import { RequestPayout } from 'components/cards/proposal-card';

export default {
  title: 'Components/Cards/ExpandedProposalCard',
  component: ExpandedProposalCard
} as Meta;

export const Template: Story<ExpandedProposalCardProps> = (
  args
): JSX.Element => <ExpandedProposalCard {...args} />;

Template.storyName = 'ExpandedProposalCard';
Template.args = {
  isOpen: true,
  status: 'Voting in progress',
  type: 'Request payout',
  title: 'meowzers.sputnikdao.near',
  name: 'jonathan.near',
  text:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis eleifend habitant laoreet ornare vitae consequat. Potenti ut urna, ultricies elit nam. Feugiat porta elit ultricies eu mollis. Faucibus mauris faucibus aliquam non. ',
  link: 'https://example.com',
  linkTitle: 'reddit.com/group',
  likes: 50,
  dislikes: 134,
  liked: false,
  disliked: false,
  endsAt: '2021-08-12T12:00:52Z',
  children: (
    <RequestPayout amount={678} recipient="jonathan.near" tokens="NEAR" />
  )
};
