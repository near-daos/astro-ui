import { Token } from 'types/token';
import { getAccumulatedTokenValue } from 'features/treasury/helpers';
import { CommonOverTime, FundsOverTime } from 'types/stats';
import { ChartDataElement } from 'components/AreaChartRenderer/types';

export function getFundsInUsdFromTokens(tokens: Record<string, Token>): string {
  const total = getAccumulatedTokenValue(tokens);

  return `${total.toFixed(2)} USD`;
}

export function mapOvertimeToChartData(
  data: FundsOverTime
): ChartDataElement[] {
  let prevBalance = 0;

  return (
    data?.metrics?.map(item => {
      const x = new Date(item.timestamp);
      const income = Number(item.incoming);
      const outcome = Number(item.outgoing);

      const balance = prevBalance + income - outcome;

      prevBalance = balance;

      return {
        x,
        y: balance,
      };
    }) ?? []
  );
}

export function mapMetricsToChartData(
  data: CommonOverTime
): ChartDataElement[] {
  return (
    data?.metrics?.map(item => {
      const x = new Date(item.timestamp);
      const count = Number(item.count);

      return {
        x,
        y: count,
      };
    }) ?? []
  );
}
