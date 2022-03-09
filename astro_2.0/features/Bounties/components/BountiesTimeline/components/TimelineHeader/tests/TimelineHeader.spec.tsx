import { render } from 'jest/testUtils';

import { TimelineHeader } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/TimelineHeader';

jest.mock('date-fns', () => {
  return {
    format: () => 'Formatted date',
  };
});

jest.mock(
  'astro_2.0/features/Bounties/components/BountiesTimeline/helpers',
  () => {
    return {
      isEndOfGranularityPeriod: () => true,
      formatColumnLabel: () => 'Formatted column label',
    };
  }
);

describe('TimelineHeader', () => {
  it('Should render component', () => {
    const { container } = render(
      <TimelineHeader
        item={new Date(2020, 12, 12)}
        granularity="day"
        rangeColumns={[new Date()]}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
