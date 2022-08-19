import { render } from 'jest/testUtils';

import { TimelineMilestone } from 'astro_2.0/features/Bounties/components/BountiesTimeline/types';

import { Milestone } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/Milestone';

jest.mock('components/Icon', () => {
  return {
    Icon: ({
      name,
      style,
    }: {
      name: string;
      style: Record<string, string>;
    }) => (
      <>
        <div>{name}</div>
        <div>{style.color}</div>
      </>
    ),
  };
});

describe('Milestone', () => {
  it.each`
    type                  | icon                       | color
    ${'Proposal Created'} | ${'bountyProposalCreated'} | ${''}
    ${'Bounty Created'}   | ${'bountyCreated'}         | ${''}
    ${'Claim'}            | ${'bountyCreateClaim'}     | ${''}
    ${'Claim'}            | ${'bountyCreateClaim'}     | ${'red'}
    ${'Complete Claim'}   | ${'bountyCompleteBounty'}  | ${''}
    ${'Complete Claim'}   | ${'bountyCompleteBounty'}  | ${'red'}
    ${'Claim Deadline'}   | ${'bountyDeadlineClaim'}   | ${''}
    ${'Claim Deadline'}   | ${'bountyDeadlineClaim'}   | ${'red'}
    ${'Pending Approval'} | ${'bountyPendingApproval'} | ${''}
    ${'Pending Approval'} | ${'bountyPendingApproval'} | ${'red'}
    ${'Complete Bounty'}  | ${'bountyCompleteBounty'}  | ${''}
  `('Should render proper icon in proper color', ({ type, icon, color }) => {
    const data = {
      type,
    } as unknown as TimelineMilestone;

    const { getByText } = render(<Milestone data={data} color={color} />);

    expect(getByText(icon)).toBeTruthy();

    if (color) {
      expect(getByText(color)).toBeTruthy();
    }
  });
});
