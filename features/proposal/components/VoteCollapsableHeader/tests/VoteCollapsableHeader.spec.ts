import { calculateVoicesThreshold } from 'features/proposal/components/VoteCollapsableHeader/helpers';

describe('VoicesThreshold', () => {
  it('returns 0 if no members in group', () => {
    const res = calculateVoicesThreshold(75, 0);

    expect(res).toEqual(0);
  });

  it('returns 4 if threshold is 75%', () => {
    const res = calculateVoicesThreshold(75, 4);

    expect(res).toEqual(4);
  });

  it('returns 2 if threshold is 50%', () => {
    const res = calculateVoicesThreshold(50, 2);

    expect(res).toEqual(2);
  });

  it('returns 1 if threshold is 49%', () => {
    const res = calculateVoicesThreshold(49, 2);

    expect(res).toEqual(1);
  });

  it('returns 2 if threshold is 51%', () => {
    const res = calculateVoicesThreshold(51, 2);

    expect(res).toEqual(2);
  });

  it('returns 3 if threshold is 57%', () => {
    const res = calculateVoicesThreshold(57, 4);

    expect(res).toEqual(3);
  });

  it('returns 4 if threshold is 76%', () => {
    const res = calculateVoicesThreshold(76, 4);

    expect(res).toEqual(4);
  });

  it('returns 4 if threshold is 100%', () => {
    const res = calculateVoicesThreshold(100, 4);

    expect(res).toEqual(4);
  });

  it('returns 17 if threshold is 99%', () => {
    const res = calculateVoicesThreshold(99, 17);

    expect(res).toEqual(17);
  });
});
