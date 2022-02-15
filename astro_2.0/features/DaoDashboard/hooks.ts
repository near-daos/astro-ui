import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { ChartDataElement } from 'components/AreaChartRenderer/types';
import {
  DaoDashboardData,
  DashboardView,
} from 'astro_2.0/features/DaoDashboard/types';

import { SputnikHttpService } from 'services/sputnik';

import {
  mapOvertimeToChartData,
  mapProposalsOvertimeToChartData,
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
          const newChartData = mapOvertimeToChartData(funds.value);

          newDashboardData.funds = mapOvertimeToChartData(funds.value);
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
          const res = await SputnikHttpService.getDaoStatsProposals(daoId);

          data = mapProposalsOvertimeToChartData(res);
          break;
        }
        case 'NFTS': {
          const res = await SputnikHttpService.getDaoStatsNfts(daoId);

          data = mapOvertimeToChartData(res);
          break;
        }
        case 'BOUNTIES': {
          const res = await SputnikHttpService.getDaoStatsBounties(daoId);

          data = mapOvertimeToChartData(res);
          break;
        }
        case 'DAO_FUNDS':
        default: {
          const res = await SputnikHttpService.getDaoStatsFunds(daoId);

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
