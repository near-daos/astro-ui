import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { Interval } from 'services/DaoStatsService/types';

import { ChartInterval } from 'astro_2.0/features/Discover/components/ChartInterval';

describe('ChartInterval', () => {
  it('Should execute callback on option change', () => {
    const setInterval = jest.fn();

    const { getAllByRole } = render(
      <ChartInterval interval={Interval.DAY} setInterval={setInterval} />
    );

    fireEvent.click(getAllByRole('radio')[1]);

    expect(setInterval).toBeCalledWith('week', expect.anything());
  });
});
