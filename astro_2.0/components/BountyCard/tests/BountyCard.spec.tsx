/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-empty-function */
import get from 'lodash/get';
import { render } from 'jest/testUtils';

import { Token } from 'types/token';
import { Proposal } from 'types/proposal';
import { BountyStatus } from 'types/bounties';

import { BountyCard } from 'astro_2.0/components/BountyCard';
import { BountyCardContent } from 'astro_2.0/components/BountyCard/types';

describe('bounty card', () => {
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
        claimHandler={() => {}}
        unclaimHandler={() => {}}
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
        claimHandler={() => {}}
        unclaimHandler={() => {}}
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
        claimHandler={() => {}}
        unclaimHandler={() => {}}
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
        claimHandler={() => {}}
        unclaimHandler={() => {}}
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
