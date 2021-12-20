import { ChartDataElement } from 'components/AreaChartRenderer/types';
import { DaoTokensStat, DaoTvl } from 'types/stats';

export type StatData = {
  count: number;
  growth: number;
};

export type DaoDashboardData = {
  daoFundsOverTime?: ChartDataElement[];
  daoTvl?: DaoTvl;
  daoTokens?: DaoTokensStat;
};

export type DashboardView = 'DAO_FUNDS' | 'BOUNTIES' | 'NFTS' | 'PROPOSALS';
