import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { ChartDataElement } from 'components/AreaChartRenderer/types';
import {
  DaoDashboardData,
  DashboardView,
} from 'astro_2.0/features/DaoDashboard/types';

import { SputnikHttpService } from 'services/sputnik';
import { useDaoStats } from 'services/ApiService/hooks/useDaoStats';
import { DaoStatsState } from 'types/daoStats';
import { useFlags } from 'launchdarkly-react-client-sdk';

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
  const { useOpenSearchDataApiDaoStats } = useFlags();

  const { data: openSearchData } = useDaoStats();

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      SputnikHttpService.getDaoStatsState(daoId),
      useOpenSearchDataApiDaoStats || useOpenSearchDataApiDaoStats === undefined
        ? Promise.reject()
        : SputnikHttpService.getDaoStatsFunds(daoId),
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
  }, [daoId, useOpenSearchDataApiDaoStats]);

  function getActiveViewData(view: DashboardView, item: DaoStatsState) {
    switch (view) {
      case 'PROPOSALS': {
        return {
          x: new Date(item.timestamp),
          y: item.activeProposalCount.value,
          y2: item.totalProposalCount.value,
        };
      }
      case 'NFTS': {
        return {
          x: new Date(item.timestamp),
          y: item.nftCount.value,
        };
      }
      case 'BOUNTIES': {
        return {
          x: new Date(item.timestamp),
          y: item.bountyCount.value,
        };
      }
      case 'DAO_FUNDS':
      default: {
        return {
          x: new Date(item.timestamp),
          y: item.totalDaoFunds.value,
        };
      }
    }
  }

  const preparedChartData = useMemo<ChartDataElement[] | null>(() => {
    if (openSearchData) {
      return openSearchData.map(item => getActiveViewData(activeView, item));
    }

    if (chartData) {
      return chartData;
    }

    return null;
  }, [chartData, openSearchData, activeView]);

  const preparedDashboardData = useMemo<DaoDashboardData>(() => {
    if (openSearchData && openSearchData.length) {
      return {
        state: {
          ...openSearchData[openSearchData.length - 1],
        },
      };
    }

    if (dashboardData) {
      return dashboardData;
    }

    return {};
  }, [openSearchData, dashboardData]);

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
    chartData: preparedChartData,
    dashboardData: preparedDashboardData,
    toggleView,
    activeView,
    loading,
  };
}
