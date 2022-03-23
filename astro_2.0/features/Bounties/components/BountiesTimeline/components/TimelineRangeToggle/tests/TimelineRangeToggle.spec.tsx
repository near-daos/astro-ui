import { fireEvent } from '@testing-library/dom';

import { render } from 'jest/testUtils';

import { TimelineRangeToggle } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/TimelineRangeToggle';

describe('TimelineHeader', () => {
  it('Should render component', () => {
    const { container } = render(
      <TimelineRangeToggle onChange={() => 0} selected="day" />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should call onChange to "zoom out"', () => {
    const onChange = jest.fn();

    const { getAllByRole } = render(
      <TimelineRangeToggle onChange={onChange} selected="day" />
    );

    fireEvent.click(getAllByRole('button')[1]);

    expect(onChange).toBeCalledWith('month');
  });

  it('Should call onChange to "zoom in"', () => {
    const onChange = jest.fn();

    const { getAllByRole } = render(
      <TimelineRangeToggle onChange={onChange} selected="month" />
    );

    fireEvent.click(getAllByRole('button')[0]);

    expect(onChange).toBeCalledWith('day');
  });
});
