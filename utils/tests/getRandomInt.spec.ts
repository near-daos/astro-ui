import { getRandomInt } from 'utils/getRandomInt';

describe('get random int', () => {
  it('Should return number from specified range', () => {
    const min = 10;
    const max = 20;
    const number = getRandomInt(10, 20);

    expect(number).toBeGreaterThanOrEqual(min);
    expect(number).toBeLessThanOrEqual(max);
  });
});
