export function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.formatToParts(amount).reduce((acc, part) => {
    let res = acc;

    const { type } = part;

    if (type !== 'currency' && type !== 'literal') {
      res += part.value;
    }

    return res;
  }, '');
}
