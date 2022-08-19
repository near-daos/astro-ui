import { render } from 'jest/testUtils';

import { BountyProposal } from 'types/bounties';

import { CompleteProposalRow } from 'astro_2.0/features/Bounties/components/BountiesListView/components/CompleteProposalRow';

jest.mock('date-fns', () => {
  return {
    format: (input: Date) => input.toString(),
  };
});

describe('CompleteProposalRow', () => {
  it.each`
    status          | statusLabel
    ${'Approved'}   | ${'Successfully approved'}
    ${'InProgress'} | ${'Pending Approval'}
    ${'AnyOther'}   | ${'Not approved'}
  `('Should render proper ui for $status status', ({ status, statusLabel }) => {
    const data = {
      status,
      proposer: 'proposer',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    } as unknown as BountyProposal;

    const { getByText } = render(<CompleteProposalRow data={data} />);

    expect(getByText(statusLabel)).toBeTruthy();
  });
});
