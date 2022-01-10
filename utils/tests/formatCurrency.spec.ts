import { formatCurrency } from 'utils/formatCurrency';

describe('format currency', () => {
  it('Should properly format amount to USD', () => {
    expect(formatCurrency(123)).toStrictEqual('123.00');
    expect(formatCurrency(123.12)).toStrictEqual('123.12');
    expect(formatCurrency(0.12)).toStrictEqual('0.12');
    expect(formatCurrency(-1230.12345678)).toStrictEqual('-1,230.12');
  });
});
