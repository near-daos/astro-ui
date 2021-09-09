import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  AddMemberToGroup,
  CreateNewGroup,
  ProposalCard,
  ProposalCardProps,
  RemoveMemberFromGroup,
  RequestPayout
} from 'components/cards/proposal-card';
import { ProposalType } from 'types/proposal';

export default {
  title: 'Components/Cards/ProposalCard',
  component: ProposalCard,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey', maxWidth: 1024 }}>
        {story()}
      </div>
    )
  ]
} as Meta;

const Template: Story<ProposalCardProps> = (args): JSX.Element => (
  <ProposalCard {...args} />
);

export const WithAddMembersToGroup = Template.bind({});

WithAddMembersToGroup.args = {
  type: ProposalType.AddMemberToRole,
  likes: 2,
  dislikes: 234,
  liked: true,
  disliked: false,
  status: 'InProgress',
  title: 'jonathan.near',
  children: (
    <AddMemberToGroup
      name="johana.near"
      groupName="Test Group"
      link="https://example.com"
      linkTitle="reddit.com"
    />
  )
};

export const WithRemoveMembersFromGroup = Template.bind({});

WithRemoveMembersFromGroup.args = {
  type: ProposalType.AddMemberToRole,
  likes: 50,
  dislikes: 134,
  liked: false,
  disliked: false,
  status: 'Rejected',
  title: 'jonathan.near',
  children: (
    <RemoveMemberFromGroup
      name="johana.near"
      groupName="Test Group"
      link="https://example.com"
      linkTitle="reddit.com"
    />
  )
};

export const WithCreateNewGroup = Template.bind({});

WithCreateNewGroup.args = {
  type: ProposalType.SetStakingContract,
  likes: 50,
  dislikes: 134,
  liked: false,
  disliked: false,
  status: 'Approved',
  title: 'jonathan.near',
  children: (
    <CreateNewGroup
      groupName="Test Group"
      link="https://example.com"
      linkTitle="reddit.com"
    />
  )
};

export const WithRequestPayout = Template.bind({});

WithRequestPayout.args = {
  type: ProposalType.Transfer,
  likes: 50,
  dislikes: 134,
  liked: false,
  disliked: false,
  status: 'Rejected',
  title: 'jonathan.near',
  children: (
    <RequestPayout
      amount={678}
      reason="the last 3 month of managing community on Discord"
      recipient="jonathan.near"
      tokens="NEAR"
      link="https://example.com"
      linkTitle="reddit.com"
    />
  )
};
