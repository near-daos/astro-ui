/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-empty-function */
import get from 'lodash/get';
import { render } from 'jest/testUtils';

import { Token } from 'types/token';
import { Proposal } from 'types/proposal';
import { BountyStatus } from 'types/bounties';

import { BountyCard } from 'astro_2.0/components/BountyCard';
import { BountyCardContent } from 'astro_2.0/components/BountyCard/types';

describe('bounty card', () => {
  const dao = {
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

  const content = ({
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

  it('Should render component', () => {
    const { container } = render(
      <BountyCard
        content={content}
        showActionBar
        canClaim
        bountyId="1"
        dao={dao}
        deadlineThreshold="1"
        completeHandler={() => {}}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render "due on" if bounty is not available', () => {
    const component = render(
      <BountyCard
        content={{
          ...content,
          status: BountyStatus.InProgress,
        }}
        showActionBar
        canClaim
        bountyId="1"
        dao={dao}
        deadlineThreshold="1"
        completeHandler={() => {}}
      />
    );

    expect(component.getAllByText('Due on', { exact: false })).toHaveLength(1);
  });

  it('Should render token info if available', () => {
    const component = render(
      <BountyCard
        content={{
          ...content,
          amount: '123456',
          token: ({
            id: '1',
            decimals: 1,
          } as unknown) as Token,
        }}
        showActionBar={false}
        canClaim
        bountyId="1"
        dao={dao}
        deadlineThreshold="1"
        completeHandler={() => {}}
      />
    );

    expect(component.getAllByText('12345.6')).toHaveLength(1);
  });

  it('Should render link to related proposal', () => {
    const component = render(
      <BountyCard
        content={{
          ...content,
          status: BountyStatus.PendingApproval,
        }}
        showActionBar
        relatedProposal={
          ({
            id: 'proposalId',
            daoId: 'myDaoId',
          } as unknown) as Proposal
        }
        canClaim
        bountyId="1"
        dao={dao}
        deadlineThreshold="1"
        completeHandler={() => {}}
      />
    );

    const linkComponent = component.getByText('Link to Proposal');

    expect(linkComponent).toBeDefined();
    expect(get(linkComponent, 'href')).toContain(
      'dao/myDaoId/proposals/proposalId'
    );
  });
});
/* eslint-enable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-empty-function */
