import { useCallback, useEffect, useState } from 'react';
import { ChartDataElement } from 'components/AreaChartRenderer/types';
import {
  DaoDashboardData,
  DashboardView,
} from 'astro_2.0/features/DaoDashboard/types';
import { SputnikStatsService } from 'services/sputnik';
import { mapMetricsToChartData } from 'astro_2.0/features/DaoDashboard/helpers';
import { useRouter } from 'next/router';

type DaoDasboardFilteredData = {
  chartData: ChartDataElement[] | null;
  dashboardData: DaoDashboardData;
  toggleView: (val: DashboardView) => void;
  activeView: DashboardView;
};

export function useDaoDashboardData(): DaoDasboardFilteredData {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const [activeView, setActiveView] = useState<DashboardView>('DAO_FUNDS');
  const [chartData, setChartData] = useState<ChartDataElement[] | null>(null);
  const [dashboardData, setDashboardData] = useState<DaoDashboardData>({});

  useEffect(() => {
    Promise.allSettled([
      SputnikStatsService.getDaoFundsOverTime(daoId),
      SputnikStatsService.getDaoTvl(daoId),
      SputnikStatsService.getDaoTokensStat(daoId),
    ]).then(res => {
      const [daoFundsOverTime, daoTvl, daoTokensStat] = res;
      const newDashboardData: DaoDashboardData = {};

      if (daoFundsOverTime.status === 'fulfilled') {
        // todo - prepare data for chart
        const newChartData = mapMetricsToChartData(
          daoFundsOverTime.value.incoming
        );

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
    });
  }, [daoId]);

  const toggleView = useCallback(
    async view => {
      let data;

      switch (view) {
        case 'PROPOSALS': {
          const res = await SputnikStatsService.getDaoUsersInteractionsOverTime(
            daoId
          );

          data = res.metrics;
          break;
        }
        case 'NFTS': {
          const res = await SputnikStatsService.getNFTsOverTime(daoId);

          data = res.metrics;
          break;
        }
        case 'BOUNTIES': {
          const res = await SputnikStatsService.getBountiesOverTime(daoId);

          data = res.metrics;
          break;
        }
        case 'DAO_FUNDS':
        default: {
          const res = await SputnikStatsService.getDaoFundsOverTime(daoId);

          data = res.incoming;
        }
      }

      if (data) {
        setChartData(mapMetricsToChartData(data));
        setActiveView(view);
      }
    },
    [daoId]
  );

  return {
    chartData,
    dashboardData,
    toggleView,
    activeView,
  };
}
