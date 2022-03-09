import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAsyncFn, useMount } from 'react-use';

import { ControlTabs } from 'astro_2.0/features/Discover/components/ControlTabs';
import { ChartRenderer } from 'astro_2.0/features/Discover/components/ChartRenderer';
import { DaosTopList } from 'astro_2.0/features/Discover/components/DaosTopList';

import {
  LeaderboardData,
  TControlTab,
} from 'astro_2.0/features/Discover/types';
import { ChartDataElement } from 'components/AreaChartRenderer/types';

import { daoStatsService } from 'services/DaoStatsService';

import {
  CONTRACT,
  DaoStatsTopics,
  getValueLabel,
  TvlTabs,
} from 'astro_2.0/features/Discover/helpers';
import { dFormatter } from 'utils/format';

import { Tvl as TTvl } from 'services/DaoStatsService/types';

import styles from './Tvl.module.scss';

export const Tvl: FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<TTvl | null>(null);
  const [chartData, setChartData] = useState<ChartDataElement[] | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardData[] | null
  >(null);

  const items = useMemo<TControlTab[]>(() => {
    return [
      {
        id: TvlTabs.PLATFORM_TVL,
        label: t('discover.platformTvl'),
        value: Number(dFormatter(data?.tvl.count ?? 0)).toLocaleString(),
        trend: data?.tvl.growth ?? 0,
      },
      {
        id: TvlTabs.VL_IN_BOUNTIES,
        label: t('discover.vlInBountiesGrants'),
        value: Number(
          dFormatter(data?.bountiesAndGrantsVl.count ?? 0)
        ).toLocaleString(),
        trend: data?.bountiesAndGrantsVl.growth ?? 0,
      },
    ];
  }, [
    data?.bountiesAndGrantsVl.count,
    data?.bountiesAndGrantsVl.growth,
    data?.tvl.count,
    data?.tvl.growth,
    t,
  ]);
  const [activeView, setActiveView] = useState<string>(items[0].id);

  const handleTopicSelect = useCallback(async (id: string) => {
    setChartData(null);
    setLeaderboardData(null);
    setActiveView(id);
  }, []);

  useMount(async () => {
    const response = await daoStatsService.getTvl(CONTRACT);

    if (response.data) {
      setData(response.data);
    }
  });

  const [{ loading }, getChartData] = useAsyncFn(async () => {
    let chart;
    let leaders;

    switch (activeView) {
      case TvlTabs.VL_IN_BOUNTIES: {
        chart = await daoStatsService.getTvlBountiesAndGrantsVl(CONTRACT);
        leaders = await daoStatsService.getTvlBountiesAndGrantsVlLeaderboard(
          CONTRACT
        );
        break;
      }
      case TvlTabs.PLATFORM_TVL:
      default: {
        chart = await daoStatsService.getTvlHistory(CONTRACT);
        leaders = await daoStatsService.getTvlLeaderboard(CONTRACT);
        break;
      }
    }

    if (chart) {
      setChartData(
        chart.data.metrics.map(({ timestamp, count }) => ({
          x: new Date(timestamp),
          y: count,
        }))
      );
    }

    if (leaders?.data?.metrics) {
      const newData =
        leaders.data.metrics.map(metric => {
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
  }, [activeView]);

  useEffect(() => {
    getChartData();
  }, [getChartData]);

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
          data={chartData}
          loading={loading}
          activeView={activeView}
        />
        <DaosTopList
          data={leaderboardData}
          valueLabel={getValueLabel(DaoStatsTopics.TVL, activeView)}
        />
      </div>
    </div>
  );
};
