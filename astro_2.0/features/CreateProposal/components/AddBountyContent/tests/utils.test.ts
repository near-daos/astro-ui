import times from 'lodash/times';
import { getAmountFieldWidth } from 'astro_2.0/features/CreateProposal/components/AddBountyContent/utils';

describe('AddBountyContent utils', () => {
  it('Should properly calculate width', () => {
    expect(getAmountFieldWidth(times(2, i => i))).toEqual(7);
    expect(getAmountFieldWidth(times(20, i => i))).toEqual(15);
    expect(getAmountFieldWidth(times(10, i => i))).toEqual(10);
    expect(getAmountFieldWidth()).toEqual(7);
  });
});
