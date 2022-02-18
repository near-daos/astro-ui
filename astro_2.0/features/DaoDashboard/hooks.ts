import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { ChartDataElement } from 'components/AreaChartRenderer/types';
import {
  DaoDashboardData,
  DashboardView,
} from 'astro_2.0/features/DaoDashboard/types';

import { SputnikHttpService } from 'services/sputnik';

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
      SputnikHttpService.getDaoStatsState(daoId),
      SputnikHttpService.getDaoStatsFunds(daoId),
    ])
      .then(res => {
        const [state, funds] = res;
        const newDashboardData: DaoDashboardData = {};

        if (state && state.status === 'fulfilled') {
          newDashboardData.state = state.value || undefined;
        }

        if (funds.status === 'fulfilled') {
          const newChartData = funds.value;

          newDashboardData.funds = funds.value;
          setChartData(newChartData);
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
          data = await SputnikHttpService.getDaoStatsProposals(daoId);
          break;
        }
        case 'NFTS': {
          data = await SputnikHttpService.getDaoStatsNfts(daoId);
          break;
        }
        case 'BOUNTIES': {
          data = await SputnikHttpService.getDaoStatsBounties(daoId);
          break;
        }
        case 'DAO_FUNDS':
        default: {
          data = await SputnikHttpService.getDaoStatsFunds(daoId);
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
