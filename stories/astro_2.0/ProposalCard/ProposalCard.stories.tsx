import React from 'react';

import { Meta, Story } from '@storybook/react';
import {
  ProposalCardRenderer,
  ProposalCardRendererProps,
} from 'astro_2.0/components/ProposalCardRenderer';
import { ProposalStatus, ProposalType, ProposalVariant } from 'types/proposal';
import { DaoFlagWidget } from 'astro_2.0/components/DaoFlagWidget';
import { DAO } from 'types/dao';
import { ProposalCard } from 'astro_2.0/components/ProposalCardRenderer/components/ProposalCard';
import { LetterHeadWidget } from 'astro_2.0/components/ProposalCardRenderer/components/LetterHeadWidget';
import { Vote } from 'features/types';
import { TransactionDetailsWidget } from 'astro_2.0/components/TransactionDetailsWidget';
import { CreateBountyProposalContent } from 'astro_2.0/components/ProposalCardRenderer/components/CreateBountyProposalContent';

export default {
  title: 'astro_2.0/ProposalCard',
  component: ProposalCardRenderer,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: '#e5e5e5', maxWidth: 885 }}>
        {story()}
      </div>
    ),
  ],
} as Meta;

export const Template: Story<ProposalCardRendererProps> = ({
  proposalCardNode,
  daoFlagNode,
  letterHeadNode,
  infoPanelNode,
}): JSX.Element => (
  <ProposalCardRenderer
    proposalCardNode={proposalCardNode}
    daoFlagNode={daoFlagNode}
    letterHeadNode={letterHeadNode}
    infoPanelNode={infoPanelNode}
  />
);

Template.storyName = 'ProposalCard';

const cardProps = {
  type: ProposalType.Transfer,
  content: (
    <CreateBountyProposalContent
      amount="1.00"
      token={{
        tokenId: '',
        symbol: 'NEAR',
        balance: '5603284827495119399999994',
        icon: '',
        decimals: 24,
        price: null,
        id: 'NEAR',
      }}
      availableClaims="3"
      daysToComplete="5"
    />
  ),
  status: 'Approved' as ProposalStatus,
  variant: ProposalVariant.ProposeTransfer,
  votePeriodEnd: '',
  voteStatus: 'Active',
  isFinalized: false,
  daoName: 'Ref.Finance',
  proposalId: 0,
  proposer: 'dkarpov.near',
  proposalTxHash: 'hash',
  flagUrl: '/dummy-flag.png',
  coverUrl: '/cover.png',
  link: 'http://google.com',
  permissions: {
    canApprove: true,
    canReject: true,
    canDelete: true,
    isCouncil: true,
  },
  likes: 32,
  dislikes: 32,
  dismisses: 32,
  voteRemove: 0,
  commentsCount: 3,
  liked: false,
  disliked: false,
  dismissed: false,
  voteDetails: {
    limit: '100%',
    label: '',
    data: [
      { vote: 'Yes' as Vote, percent: 50 },
      { vote: 'No' as Vote, percent: 25 },
      { vote: 'Dismiss' as Vote, percent: 25 },
    ],
  },
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis eleifend habitant laoreet ornare vitae consequat. Potenti ut urna, ultricies elit nam. Feugiat porta elit ultricies eu mollis. Faucibus mauris faucibus aliquam non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis eleifend habitant laoreet ornare vitae consequat. Potenti ut urna, ultricies elit nam.',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dao = {
  legal: {},
  id: 'testdao3-near-cli-example.sputnikv2.testnet',
  txHash: 'GBUmu3jrdmYYHH2bmcs2qVMRpV5snTh5CouEToxo2Viv',
  name: 'testdao3-near-cli-example',
  description: '',
  daoVersion: {
    createdAt: '',
    hash: '',
    changelogUrl: '',
    commitId: '',
    version: [],
  },
  daoVersionHash: '',
  members: 1,
  daoMembersList: ['jason.born'],
  activeProposalsCount: 11,
  totalProposalsCount: 15,
  totalDaoFunds: 77,
  proposals: 11,
  totalProposals: 15,
  lastProposalId: 12,
  logo: 'https://sputnik-dao.s3.eu-central-1.amazonaws.com/3RFSVcbRRXIGNxq5C1OMI',
  funds: '6.10334',
  createdAt: '2021-11-01T08:21:53.955Z',
  groups: [
    {
      members: ['testdao2.testnet'],
      name: 'Council',
      permissions: [
        '*:VoteReject',
        '*:VoteRemove',
        '*:VoteApprove',
        '*:AddProposal',
        '*:Finalize',
      ],
      votePolicy: {},
      slug: 'Council',
    },
  ],
  policy: {
    isArchived: false,
    createdAt: '2021-11-01T08:21:53.955Z',
    updatedAt: '2021-11-01T08:21:53.955Z',
    daoId: 'testdao3-near-cli-example.sputnikv2.testnet',
    proposalBond: '100000000000000000000000',
    bountyBond: '100000000000000000000000',
    proposalPeriod: '604800000000000',
    bountyForgivenessPeriod: '604800000000000',
    defaultVotePolicy: {
      weightKind: 'RoleWeight',
      weight: 'RoleWeight',
      quorum: '0',
      kind: 'Ratio',
      ratio: [1, 2],
    },
    roles: [
      {
        isArchived: false,
        createdAt: '2021-11-01T08:21:53.955Z',
        updatedAt: '2021-11-02T14:02:04.271Z',
        id: 'testdao3-near-cli-example.sputnikv2.testnet-Council',
        name: 'Council',
        kind: 'Group',
        balance: null,
        accountIds: ['testdao2.testnet'],
        permissions: [
          '*:VoteReject',
          '*:VoteRemove',
          '*:VoteApprove',
          '*:AddProposal',
          '*:Finalize',
        ],
        votePolicy: {},
        policy: {
          daoId: 'testdao3-near-cli-example.sputnikv2.testnet',
        },
      },
    ],
  },
  links: [],
  displayName: 'TestDAO3 NEAR CLI example',
} as DAO;

const createProposalProps = {
  onCreate: () => {
    // eslint-disable-next-line no-console
    console.log('proposal created');
  },
  onSubmit: () => Promise.resolve(),
  bond: { value: '0.1' },
  gas: { value: '0.2' },
};

Template.args = {
  daoFlagNode: (
    <DaoFlagWidget daoName="Ref.Finance" flagUrl="/dummy-flag.png" daoId="" />
  ),
  proposalCardNode: <ProposalCard {...cardProps} accountId="123" daoId="" />,
  letterHeadNode: (
    <LetterHeadWidget type={ProposalType.Transfer} coverUrl="/cover.png" />
  ),
  infoPanelNode: <TransactionDetailsWidget {...createProposalProps} />,
};
