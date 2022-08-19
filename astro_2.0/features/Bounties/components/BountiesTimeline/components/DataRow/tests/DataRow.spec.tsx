import { render } from 'jest/testUtils';

import { TimelineMilestone } from 'astro_2.0/features/Bounties/components/BountiesTimeline/types';

import { DataRow } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/DataRow';

describe('DataRow', () => {
  it('Should render component', () => {
    const item = {
      type: 'Pending Approval',
    } as unknown as TimelineMilestone;

    const { container } = render(
      <DataRow
        data={[item]}
        rangeColumns={[new Date(2222, 12, 12)]}
        granularity="day"
        minDate={null}
        maxDate={null}
        isGroupRow={false}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
