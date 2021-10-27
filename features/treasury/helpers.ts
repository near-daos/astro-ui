import { Receipt } from 'types/transaction';
import { ChartData } from 'lib/types/treasury';

export function getChartData(receipts: Receipt[]): ChartData[] {
  let value = 0;
  const result: ChartData[] = [];

  receipts
    .sort((a, b) => {
      if (a.timestamp > b.timestamp) return 1;

      if (a.timestamp < b.timestamp) return -1;

      return 0;
    })
    .forEach((item: Receipt) => {
      const income = item.type === 'Deposit';
      let balance;

      const deposit = Number(item.deposit);

      if (income) {
        balance = value + deposit;
      } else {
        balance = value - deposit;
      }

      value = balance;

      result.push({
        balance,
        timestamp: item.timestamp,
      });
    });

  return result;
}
