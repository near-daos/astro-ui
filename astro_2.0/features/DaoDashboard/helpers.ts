import { Token } from 'types/token';
import { getAccumulatedTokenValue } from 'features/treasury/helpers';
import { CommonOverTime } from 'types/stats';
import { ChartDataElement } from 'components/AreaChartRenderer/types';
import { DaoStatsOvertime, DaoStatsProposalsOvertime } from 'types/daoStats';

export function getFundsInUsdFromTokens(tokens: Record<string, Token>): string {
  const total = getAccumulatedTokenValue(tokens);

  return `${total.toFixed(2)} USD`;
}

export function mapOvertimeToChartData(
  data: DaoStatsOvertime[]
): ChartDataElement[] {
  return (
    data.map(item => {
      const x = new Date(item.timestamp);
      const y = item.value;

      return {
        x,
        y,
      };
    }) ?? []
  );
}

export function mapProposalsOvertimeToChartData(
  data: DaoStatsProposalsOvertime[]
): ChartDataElement[] {
  return (
    data.reduce<ChartDataElement[]>((res, item) => {
      const x = new Date(item.timestamp);
      const { active, total } = item;

      res.push({
        x,
        y: active,
        y2: total,
      });

      return res;
    }, []) ?? []
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
