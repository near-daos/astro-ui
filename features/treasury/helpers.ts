import { Transaction } from 'types/transaction';
import { ChartData } from 'lib/types/treasury';

export function getChartData(
  transactions: Transaction[],
  price: number
): ChartData[] {
  let value = 0;
  const result: ChartData[] = [];

  transactions
    .sort((a, b) => {
      if (a.timestamp > b.timestamp) return 1;

      if (a.timestamp < b.timestamp) return -1;

      return 0;
    })
    .forEach((item: Transaction) => {
      const income = item.type === 'Deposit';
      let balance;

      const deposit = Number(Number(item.deposit) * price);

      if (income) {
        balance = value + deposit;
      } else {
        balance = value - deposit;
      }

      value = balance;

      result.push({
        balance,
        timestamp: item.timestamp
      });
    });

  return result;
}
