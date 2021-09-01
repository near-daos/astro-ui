import flag from 'stories/dao-home/assets/flag.png';
import { DaoDetailsProps } from 'features/dao-home/components/dao-details/DaoDetails';
import { DaoInfoCardProps } from 'components/cards/dao-info-card/DaoInfoCard';
import {
  AddMemberToGroup,
  CreateNewGroup,
  ProposalCardProps,
  RemoveMemberFromGroup,
  RequestPayout
} from 'components/cards/proposal-card';
import React from 'react';

export const DAO_DETAILS: DaoDetailsProps = {
  title: 'Meowzers',
  subtitle: 'meowzers.sputnikdao.near',
  description: `We’re a community grant for artists who want to build projects on our
    platform. Join our Discord channel to stay up to date with latest info!`,
  flag,
  createdAt: '',
  links: ['http://example.com', 'http://discord.com', 'http://twitter.com']
};

export const DAO_PROPOSALS: ProposalCardProps[] = [
  {
    type: 'Request payout',
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onDislike: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onLike: () => {},
    likes: 50,
    dislikes: 134,
    liked: false,
    disliked: false,
    status: 'Dismissed as spam',
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
  },
  {
    type: 'Request payout',
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onDislike: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onLike: () => {},
    likes: 50,
    dislikes: 134,
    liked: false,
    disliked: false,
    status: 'Dismissed as spam',
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
  },
  {
    type: 'Request payout',
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onDislike: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onLike: () => {},
    likes: 50,
    dislikes: 134,
    liked: false,
    disliked: false,
    status: 'Dismissed as spam',
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
  },
  {
    type: 'Request payout',
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onDislike: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onLike: () => {},
    likes: 50,
    dislikes: 134,
    liked: false,
    disliked: false,
    status: 'Dismissed as spam',
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
  },
  {
    type: 'Create group',
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onDislike: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onLike: () => {},
    likes: 50,
    dislikes: 134,
    liked: false,
    disliked: false,
    status: 'Passed',
    title: 'jonathan.near',
    children: (
      <CreateNewGroup
        groupName="Test Group"
        link="https://example.com"
        linkTitle="reddit.com"
      />
    )
  },
  {
    type: 'Remove member',
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onDislike: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onLike: () => {},
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
  },
  {
    type: 'Add member',
    likes: 2,
    dislikes: 234,
    liked: true,
    disliked: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onLike: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onDislike: () => {},
    status: 'Voting in progress',
    title: 'jonathan.near',
    children: (
      <AddMemberToGroup
        name="johana.near"
        groupName="Test Group"
        link="https://example.com"
        linkTitle="reddit.com"
      />
    )
  }
];

export const DAO_INFO: DaoInfoCardProps = {
  items: [
    {
      label: 'Members',
      value: '96'
    },
    {
      label: 'DAO funds',
      value: '54,650.42 USD'
    }
  ]
};
