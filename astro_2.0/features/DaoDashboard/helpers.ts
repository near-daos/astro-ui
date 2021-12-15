import { Token } from 'types/token';
import { getAccumulatedTokenValue } from 'features/treasury/helpers';
import { Metric } from 'types/stats';
import { ChartDataElement } from 'components/AreaChartRenderer/types';

export function getFundsInUsdFromTokens(tokens: Record<string, Token>): string {
  const total = getAccumulatedTokenValue(tokens);

  return `${total.toFixed(2)} USD`;
}

export function mapMetricsToChartData(data: Metric[]): ChartDataElement[] {
  return data.map(item => ({
    x: new Date(item.timestamp),
    y: Number(item.count),
  }));
}
