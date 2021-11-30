import { Receipt } from 'types/transaction';
import { ChartData } from 'types/chart';
import { formatYoktoValue } from 'helpers/format';
import { Token } from 'types/token';

export function getChartData(receipts: Receipt[], token: Token): ChartData[] {
  let value = 0;
  const result: ChartData[] = [];

  if (!receipts || !token) {
    return result;
  }

  receipts
    .sort((a, b) => {
      if (a.timestamp > b.timestamp) return 1;

      if (a.timestamp < b.timestamp) return -1;

      return 0;
    })
    .forEach((item: Receipt) => {
      const income = item.type === 'Deposit';
      let balance;

      const deposit = Number(formatYoktoValue(item.deposit, token.decimals));

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
