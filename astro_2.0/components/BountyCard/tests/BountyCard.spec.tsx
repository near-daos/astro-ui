/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-empty-function */
import get from 'lodash/get';
import { render } from 'jest/testUtils';

import { Token } from 'types/token';
import { Proposal } from 'types/proposal';
import { BountyStatus } from 'types/bounties';

import { BountyCard } from 'astro_2.0/components/BountyCard';

import { contentMock, daoMock } from './mock';

describe('bounty card', () => {
  it('Should render component', () => {
    const { container } = render(
      <BountyCard
        content={contentMock}
        showActionBar
        canClaim
        bountyId="1"
        dao={daoMock}
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
          ...contentMock,
          status: BountyStatus.InProgress,
        }}
        showActionBar
        canClaim
        bountyId="1"
        dao={daoMock}
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
          ...contentMock,
          amount: '123456',
          token: ({
            id: '1',
            decimals: 1,
          } as unknown) as Token,
        }}
        showActionBar={false}
        canClaim
        bountyId="1"
        dao={daoMock}
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
          ...contentMock,
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
        dao={daoMock}
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
