import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAsync, useMountedState } from 'react-use';

import { ControlTabs } from 'astro_2.0/features/Discover/components/ControlTabs';
import { ChartRenderer } from 'astro_2.0/features/Discover/components/ChartRenderer';
import { DaosTopList } from 'astro_2.0/features/Discover/components/DaosTopList';

import { TControlTab } from 'astro_2.0/features/Discover/types';
import { useDaoStatsContext } from 'astro_2.0/features/Discover/DaoStatsDataProvider';
import { LIMIT } from 'services/DaoStatsService';

import { getValueLabel } from 'astro_2.0/features/Discover/helpers';
import {
  CONTRACT,
  DaoStatsTopics,
  FlowTabs,
} from 'astro_2.0/features/Discover/constants';
import { dFormatter } from 'utils/format';
import useQuery from 'hooks/useQuery';
import { Icon } from 'components/Icon';
import { useDiscoveryState } from 'astro_2.0/features/Discover/hooks';

import { Flow as TFlow, FlowMetricsItem } from 'services/DaoStatsService/types';

import styles from './Flow.module.scss';

export const Flow: FC = () => {
  const isMounted = useMountedState();
  const { t } = useTranslation();
  const { daoStatsService } = useDaoStatsContext();
  const [data, setData] = useState<TFlow | null>(null);
  const { query } = useQuery<{ dao: string }>();

  const items = useMemo<TControlTab[]>(() => {
    return [
      {
        id: FlowTabs.TOTAL_IN,
        label: t('discover.totalIn'),
        value: Number(dFormatter(data?.totalIn.count ?? 0, 2)).toLocaleString(),
        trend: data?.totalOut.growth ?? 0,
        icon: data?.totalIn.count ? (
          <Icon
            name="tokenNear"
            width={10}
            height={10}
            className={styles.nearIcon}
          />
        ) : null,
      },
      {
        id: FlowTabs.TOTAL_OUT,
        label: t('discover.totalOut'),
        value: Number(
          dFormatter(data?.totalOut.count ?? 0, 2)
        ).toLocaleString(),
        trend: data?.totalOut.growth ?? 0,
        icon: data?.totalOut.count ? (
          <Icon
            name="tokenNear"
            width={10}
            height={10}
            className={styles.nearIcon}
          />
        ) : null,
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
  const {
    setOffset,
    setTotal,
    total,
    offset,
    leaderboardData,
    setLeaderboardData,
    chartData,
    setChartData,
    setActiveView,
    activeView,
  } = useDiscoveryState(items);

  const handleTopicSelect = useCallback(
    async (id: string) => {
      if (!isMounted()) {
        return;
      }

      setActiveView(id);
    },
    [setActiveView, isMounted]
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
  }, [query.dao, isMounted, daoStatsService]);

  const { loading } = useAsync(async () => {
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

  useAsync(async () => {
    if (query.dao) {
      return;
    }

    let leaders;

    switch (activeView) {
      case FlowTabs.INCOMING_TRANSACTIONS:
      case FlowTabs.OUTGOING_TRANSACTIONS: {
        leaders = await daoStatsService.getFlowTransactionsLeaderboard({
          ...CONTRACT,
          offset,
        });
        break;
      }
      case FlowTabs.TOTAL_OUT:
      case FlowTabs.TOTAL_IN:
      default: {
        leaders = await daoStatsService.getFlowLeaderboard({
          ...CONTRACT,
          offset,
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
          dataset.map(metric => ({
            ...metric,
            overview:
              metric.overview?.map(({ timestamp, count }) => ({
                x: new Date(timestamp),
                y: count,
              })) ?? [],
          })) ?? null;

        setTotal(
          isIncome ? leaders.data.incomingTotal : leaders.data.outgoingTotal
        );
        setLeaderboardData(
          leaderboardData ? [...leaderboardData, ...newData] : newData
        );
      }
    }
  }, [activeView, query.dao, isMounted, offset]);

  const nextLeaderboardItems = () => {
    setOffset(offset + LIMIT);
  };

  return (
    <div className={styles.root}>
      <ControlTabs
        className={styles.header}
        items={items}
        onSelect={handleTopicSelect}
        activeView={activeView}
      />
      <div className={styles.body}>
        <ChartRenderer
          unit={
            <Icon
              name="tokenNear"
              width={10}
              height={10}
              className={styles.nearIcon}
            />
          }
          unitPosition="right"
          data={chartData}
          loading={loading}
          activeView={activeView}
        />
        <DaosTopList
          unit={
            <Icon
              name="tokenNear"
              width={10}
              height={10}
              className={styles.nearIcon}
            />
          }
          unitPosition="right"
          total={total}
          next={nextLeaderboardItems}
          data={leaderboardData}
          valueLabel={getValueLabel(DaoStatsTopics.FLOW, activeView)}
        />
      </div>
    </div>
  );
};
