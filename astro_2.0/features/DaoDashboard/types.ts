import { ChartDataElement } from 'components/AreaChartRenderer/types';
import { DaoStatsState } from 'types/daoStats';

export type StatData = {
  count: number;
  growth: number;
};

export type DaoDashboardData = {
  state?: DaoStatsState;
  funds?: ChartDataElement[];
  bounties?: ChartDataElement[];
  nfts?: ChartDataElement[];
  proposals?: ChartDataElement[];
};

export type DashboardView = 'DAO_FUNDS' | 'BOUNTIES' | 'NFTS' | 'PROPOSALS';
