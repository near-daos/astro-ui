import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { ChartDataElement } from 'components/AreaChartRenderer/types';
import {
  DaoDashboardData,
  DashboardView,
} from 'astro_2.0/features/DaoDashboard/types';

import { SputnikStatsService } from 'services/sputnik';

import {
  mapMetricsToChartData,
  mapOvertimeToChartData,
} from 'astro_2.0/features/DaoDashboard/helpers';

type DaoDasboardFilteredData = {
  chartData: ChartDataElement[] | null;
  dashboardData: DaoDashboardData;
  toggleView: (val: DashboardView) => void;
  activeView: DashboardView;
  loading: boolean;
};

export function useDaoDashboardData(): DaoDasboardFilteredData {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const [activeView, setActiveView] = useState<DashboardView>('DAO_FUNDS');
  const [chartData, setChartData] = useState<ChartDataElement[] | null>(null);
  const [dashboardData, setDashboardData] = useState<DaoDashboardData>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      SputnikStatsService.getDaoFundsOverTime(daoId),
      SputnikStatsService.getDaoTvl(daoId),
      SputnikStatsService.getDaoTokensStat(daoId),
    ])
      .then(res => {
        const [daoFundsOverTime, daoTvl, daoTokensStat] = res;
        const newDashboardData: DaoDashboardData = {};

        if (daoFundsOverTime.status === 'fulfilled') {
          const newChartData = mapOvertimeToChartData(daoFundsOverTime.value);

          newDashboardData.daoFundsOverTime = [...newChartData];
          setChartData(newChartData);
        }

        if (daoTvl.status === 'fulfilled') {
          newDashboardData.daoTvl = daoTvl.value;
        }

        if (daoTokensStat.status === 'fulfilled') {
          newDashboardData.daoTokens = daoTokensStat.value;
        }

        setDashboardData(newDashboardData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [daoId]);

  const toggleView = useCallback(
    async view => {
      setLoading(true);

      let data;

      switch (view) {
        case 'PROPOSALS': {
          const res = await SputnikStatsService.getDaoUsersInteractionsOverTime(
            daoId
          );

          data = mapMetricsToChartData(res);
          break;
        }
        case 'NFTS': {
          const res = await SputnikStatsService.getNFTsOverTime(daoId);

          data = mapMetricsToChartData(res);
          break;
        }
        case 'BOUNTIES': {
          const res = await SputnikStatsService.getBountiesOverTime(daoId);

          data = mapMetricsToChartData(res);
          break;
        }
        case 'DAO_FUNDS':
        default: {
          const res = await SputnikStatsService.getDaoFundsOverTime(daoId);

          data = mapOvertimeToChartData(res);
        }
      }

      if (data) {
        setChartData(data);
        setActiveView(view);
      }

      setLoading(false);
    },
    [daoId]
  );

  return {
    chartData,
    dashboardData,
    toggleView,
    activeView,
    loading,
  };
}
