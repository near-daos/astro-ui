import { render } from 'jest/testUtils';
import { RenderResult } from '@testing-library/react';

import { BountyProposal } from 'types/bounties';

import { ClaimRow } from 'astro_2.0/features/Bounties/components/BountiesListView/components/ClaimRow';

import { bounty, daoMock } from './mock';

jest.mock(
  'astro_2.0/features/Bounties/components/BountiesListView/components/VotingContent',
  () => {
    return {
      VotingContent: () => <div>VotingContent</div>,
    };
  }
);

describe('ClaimRow', () => {
  const id = '123';

  const data = {
    id,
    accountId: 'account id',
    startTime: '1000000000000',
    deadline: 'deadline',
    completed: true,
    endTime: 'end time',
  };

  function renderClaimRow(bountyProposal?: BountyProposal): RenderResult {
    const proposals = bountyProposal ? [bountyProposal] : [];

    return render(
      <ClaimRow
        data={data}
        dao={daoMock}
        bounty={bounty}
        doneProposals={proposals}
        maxDeadline="1000000000000"
        claimedByMe
      />
    );
  }

  it('Should render "In progress" state', () => {
    const { getByText } = renderClaimRow();

    expect(getByText('In progress')).toBeInTheDocument();
  });

  it('Should render "Not approved" state', () => {
    const { getByText } = renderClaimRow({
      bountyClaimId: id,
    } as unknown as BountyProposal);

    expect(getByText('Not approved')).toBeInTheDocument();
  });

  it('Should render "Approved" state', () => {
    const { getByText } = renderClaimRow({
      bountyClaimId: id,
      status: 'Approved',
    } as unknown as BountyProposal);

    expect(getByText('Successfully approved')).toBeInTheDocument();
  });

  it('Should render "Pending Approval" state', () => {
    const { getByText } = renderClaimRow({
      bountyClaimId: id,
      status: 'InProgress',
    } as unknown as BountyProposal);

    expect(getByText('Pending Approval')).toBeInTheDocument();
  });
});
