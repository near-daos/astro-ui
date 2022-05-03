import { nanosToDays } from 'astro_2.0/features/DaoGovernance/helper';

describe('DaoGovernance helpers', () => {
  it('Should convert nanoseconds to days', () => {
    const secondsInDay = '86400';

    expect(nanosToDays(`${secondsInDay}000000000`)).toEqual(['1', 'day']);
  });
});
