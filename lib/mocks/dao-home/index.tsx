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
import { ProposalType } from 'types/proposal';
import { DAO } from 'types/dao';

export const DAO_DETAILS: DaoDetailsProps = {
  title: 'Meowzers',
  subtitle: 'meowzers.sputnikdao.near',
  description: `We’re a community grant for artists who want to build projects on our
    platform. Join our Discord channel to stay up to date with latest info!`,
  flag,
  createdAt: '',
  links: [
    'http://example.com',
    'http://discord.com',
    'http://telegram.org',
    'http://twitter.com'
  ],
  more: {
    label: 'Show more',
    link: 'http://example.com'
  },
  sendFunds: true,
  followed: true
};

export const DAO_PROPOSALS: ProposalCardProps[] = [
  {
    id: '1',
    type: ProposalType.Transfer,
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onDislike: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onLike: () => {},
    likes: 50,
    dislikes: 134,
    liked: false,
    disliked: false,
    dismisses: 0,
    dismissed: false,
    status: 'Rejected',
    title: 'jonathan.near',
    votePeriodEnd: '',
    daoDetails: {
      name: 'my-awesome-dao',
      logo: ''
    },
    proposalId: 1,
    daoId: 'my-awesome-dao',
    children: (
      <RequestPayout
        amount="236"
        reason="the last 3 month of managing community on Discord"
        recipient="jonathan.near"
        tokens="NEAR"
        link="https://example.com"
        linkTitle="reddit.com"
      />
    ),
    dao: {} as DAO
  },
  {
    id: '2',
    type: ProposalType.Transfer,
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onDislike: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onLike: () => {},
    likes: 50,
    dislikes: 134,
    liked: false,
    disliked: false,
    dismisses: 0,
    dismissed: false,
    status: 'Rejected',
    title: 'jonathan.near',
    votePeriodEnd: '',
    daoDetails: {
      name: 'my-awesome-dao',
      logo: ''
    },
    proposalId: 1,
    daoId: 'my-awesome-dao',
    children: (
      <RequestPayout
        amount="345"
        reason="the last 3 month of managing community on Discord"
        recipient="jonathan.near"
        tokens="NEAR"
        link="https://example.com"
        linkTitle="reddit.com"
      />
    ),
    dao: {} as DAO
  },
  {
    id: '3',
    type: ProposalType.Transfer,
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onDislike: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onLike: () => {},
    likes: 50,
    dislikes: 134,
    liked: false,
    disliked: false,
    dismisses: 0,
    dismissed: false,
    status: 'Rejected',
    title: 'jonathan.near',
    votePeriodEnd: '',
    daoDetails: {
      name: 'my-awesome-dao',
      logo: ''
    },
    proposalId: 1,
    daoId: 'my-awesome-dao',
    children: (
      <RequestPayout
        amount="542"
        reason="the last 3 month of managing community on Discord"
        recipient="jonathan.near"
        tokens="NEAR"
        link="https://example.com"
        linkTitle="reddit.com"
      />
    ),
    dao: {} as DAO
  },
  {
    id: '4',
    type: ProposalType.Transfer,
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onDislike: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onLike: () => {},
    likes: 50,
    dislikes: 134,
    liked: false,
    disliked: false,
    dismisses: 0,
    dismissed: false,
    status: 'Rejected',
    title: 'jonathan.near',
    votePeriodEnd: '',
    daoDetails: {
      name: 'my-awesome-dao',
      logo: ''
    },
    proposalId: 1,
    daoId: 'my-awesome-dao',
    children: (
      <RequestPayout
        amount="674"
        reason="the last 3 month of managing community on Discord"
        recipient="jonathan.near"
        tokens="NEAR"
        link="https://example.com"
        linkTitle="reddit.com"
      />
    ),
    dao: {} as DAO
  },
  {
    id: '5',
    type: ProposalType.SetStakingContract,
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onDislike: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onLike: () => {},
    likes: 50,
    dislikes: 134,
    liked: false,
    disliked: false,
    dismisses: 0,
    dismissed: false,
    status: 'Approved',
    title: 'jonathan.near',
    votePeriodEnd: '',
    daoDetails: {
      name: 'my-awesome-dao',
      logo: ''
    },
    proposalId: 1,
    daoId: 'my-awesome-dao',
    children: (
      <CreateNewGroup
        groupName="Test Group"
        link="https://example.com"
        linkTitle="reddit.com"
      />
    ),
    dao: {} as DAO
  },
  {
    id: '6',
    type: ProposalType.AddMemberToRole,
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onDislike: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onLike: () => {},
    likes: 50,
    dislikes: 134,
    liked: false,
    disliked: false,
    dismisses: 0,
    dismissed: false,
    status: 'Rejected',
    title: 'jonathan.near',
    votePeriodEnd: '',
    daoDetails: {
      name: 'my-awesome-dao',
      logo: ''
    },
    proposalId: 1,
    daoId: 'my-awesome-dao',
    children: (
      <RemoveMemberFromGroup
        name="johana.near"
        groupName="Test Group"
        link="https://example.com"
        linkTitle="reddit.com"
      />
    ),
    dao: {} as DAO
  },
  {
    id: '7',
    type: ProposalType.AddMemberToRole,
    likes: 2,
    dislikes: 234,
    liked: true,
    disliked: false,
    dismisses: 0,
    dismissed: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onLike: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    onDislike: () => {},
    status: 'InProgress',
    title: 'jonathan.near',
    votePeriodEnd: '',
    dao: {} as DAO,
    daoDetails: {
      name: 'my-awesome-dao',
      logo: ''
    },
    proposalId: 1,
    daoId: 'my-awesome-dao',
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
