import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAsyncFn, useMountedState } from 'react-use';

import { ControlTabs } from 'astro_2.0/features/Discover/components/ControlTabs';
import { ChartRenderer } from 'astro_2.0/features/Discover/components/ChartRenderer';
import { DaosTopList } from 'astro_2.0/features/Discover/components/DaosTopList';

import {
  LeaderboardData,
  TControlTab,
} from 'astro_2.0/features/Discover/types';
import { ChartDataElement } from 'components/AreaChartRenderer/types';

import { daoStatsService, LIMIT } from 'services/DaoStatsService';

import { getValueLabel } from 'astro_2.0/features/Discover/helpers';
import {
  CONTRACT,
  DaoStatsTopics,
  FlowTabs,
} from 'astro_2.0/features/Discover/constants';
import { dFormatter } from 'utils/format';
import useQuery from 'hooks/useQuery';

import { Flow as TFlow, FlowMetricsItem } from 'services/DaoStatsService/types';

import styles from './Flow.module.scss';

export const Flow: FC = () => {
  const isMounted = useMountedState();
  const { t } = useTranslation();
  const [data, setData] = useState<TFlow | null>(null);
  const [chartData, setChartData] = useState<ChartDataElement[] | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardData[] | null
  >(null);

  const { query } = useQuery<{ dao: string }>();

  const items = useMemo<TControlTab[]>(() => {
    return [
      {
        id: FlowTabs.TOTAL_IN,
        label: t('discover.totalIn'),
        value: Number(dFormatter(data?.totalIn.count ?? 0, 2)).toLocaleString(),
        trend: data?.totalOut.growth ?? 0,
      },
      {
        id: FlowTabs.TOTAL_OUT,
        label: t('discover.totalOut'),
        value: Number(
          dFormatter(data?.totalOut.count ?? 0, 2)
        ).toLocaleString(),
        trend: data?.totalOut.growth ?? 0,
      },
      {
        id: FlowTabs.INCOMING_TRANSACTIONS,
        label: t('discover.incomingTransactions'),
        value: Number(
          dFormatter(data?.transactionsIn.count ?? 0)
        ).toLocaleString(),
        trend: data?.transactionsIn.growth ?? 0,
      },
      {
        id: FlowTabs.OUTGOING_TRANSACTIONS,
        label: t('discover.outgoingTransactions'),
        value: Number(
          dFormatter(data?.transactionsOut.count ?? 0)
        ).toLocaleString(),
        trend: data?.transactionsOut.growth ?? 0,
      },
    ];
  }, [
    data?.totalIn.count,
    data?.totalOut.count,
    data?.totalOut.growth,
    data?.transactionsIn.count,
    data?.transactionsIn.growth,
    data?.transactionsOut.count,
    data?.transactionsOut.growth,
    t,
  ]);
  const [activeView, setActiveView] = useState(items[0].id);
  const [limit, setLimit] = useState(LIMIT);

  const handleTopicSelect = useCallback(
    async (id: string) => {
      if (!isMounted()) {
        return;
      }

      setChartData(null);
      setLeaderboardData(null);
      setLimit(LIMIT);
      setActiveView(id);
    },
    [isMounted]
  );

  useEffect(() => {
    (async () => {
      const response = query.dao
        ? await daoStatsService.getFlowDao({ ...CONTRACT, dao: query.dao })
        : await daoStatsService.getFlow(CONTRACT);

      if (response.data && isMounted()) {
        setData(response.data);
      }
    })();
  }, [query.dao, isMounted]);

  const [{ loading }, getChartData] = useAsyncFn(async () => {
    let chart;

    if (query.dao) {
      const params = {
        ...CONTRACT,
        dao: query.dao,
      };

      switch (activeView) {
        case FlowTabs.INCOMING_TRANSACTIONS:
        case FlowTabs.OUTGOING_TRANSACTIONS: {
          chart = await daoStatsService.getFlowDaoTransactions(params);
          break;
        }
        case FlowTabs.TOTAL_OUT:
        case FlowTabs.TOTAL_IN:
        default: {
          chart = await daoStatsService.getFlowDaoFunds(params);
          break;
        }
      }
    } else {
      switch (activeView) {
        case FlowTabs.INCOMING_TRANSACTIONS:
        case FlowTabs.OUTGOING_TRANSACTIONS: {
          chart = await daoStatsService.getFlowTransactionsHistory(CONTRACT);
          break;
        }
        case FlowTabs.TOTAL_OUT:
        case FlowTabs.TOTAL_IN:
        default: {
          chart = await daoStatsService.getFlowHistory(CONTRACT);
          break;
        }
      }
    }

    if (chart && isMounted()) {
      setChartData(
        (chart.data.metrics as FlowMetricsItem[]).map(
          ({ timestamp, incoming, outgoing }) => ({
            x: new Date(timestamp),
            y:
              activeView === FlowTabs.TOTAL_IN ||
              activeView === FlowTabs.INCOMING_TRANSACTIONS
                ? incoming
                : outgoing,
          })
        )
      );
    }
  }, [activeView, query.dao, isMounted]);

  const [, getLeaderboardData] = useAsyncFn(async () => {
    if (query.dao) {
      return;
    }

    let leaders;

    switch (activeView) {
      case FlowTabs.INCOMING_TRANSACTIONS:
      case FlowTabs.OUTGOING_TRANSACTIONS: {
        leaders = await daoStatsService.getFlowTransactionsLeaderboard({
          ...CONTRACT,
          limit,
        });
        break;
      }
      case FlowTabs.TOTAL_OUT:
      case FlowTabs.TOTAL_IN:
      default: {
        leaders = await daoStatsService.getFlowLeaderboard({
          ...CONTRACT,
          limit,
        });
        break;
      }
    }

    if (leaders?.data && isMounted()) {
      const isIncome =
        activeView === FlowTabs.TOTAL_IN ||
        activeView === FlowTabs.INCOMING_TRANSACTIONS;
      const dataset = isIncome ? leaders.data.incoming : leaders.data.outgoing;

      if (dataset) {
        const newData =
          dataset.map(metric => {
            return {
              ...metric,
              overview:
                metric.overview?.map(({ timestamp, count }) => ({
                  x: new Date(timestamp),
                  y: count,
                })) ?? [],
            };
          }) ?? null;

        setLeaderboardData(newData);
      }
    }
  }, [activeView, query.dao, isMounted, limit]);

  useEffect(() => {
    getChartData();
  }, [getChartData]);

  useEffect(() => {
    getLeaderboardData();
  }, [getLeaderboardData]);

  const nextLeaderboardItems = () => {
    setLimit(limit + LIMIT);
  };

  return (
    <div className={styles.root}>
      <ControlTabs
        loading={loading}
        className={styles.header}
        items={items}
        onSelect={handleTopicSelect}
        activeView={activeView}
      />
      <div className={styles.body}>
        <ChartRenderer
          data={chartData}
          loading={loading}
          activeView={activeView}
        />
        <DaosTopList
          next={nextLeaderboardItems}
          data={leaderboardData}
          valueLabel={getValueLabel(DaoStatsTopics.FLOW, activeView)}
        />
      </div>
    </div>
  );
};
