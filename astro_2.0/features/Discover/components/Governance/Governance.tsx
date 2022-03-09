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
  GovernanceTabs,
} from 'astro_2.0/features/Discover/helpers';

import { Governance as TGovernance } from 'services/DaoStatsService/types';

import styles from './Governance.module.scss';

export const Governance: FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<TGovernance | null>(null);
  const [chartData, setChartData] = useState<ChartDataElement[] | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardData[] | null
  >(null);

  const items = useMemo<TControlTab[]>(() => {
    return [
      {
        id: GovernanceTabs.NUMBER_OF_PROPOSALS,
        label: t('discover.numberOfProposals'),
        value: (data?.proposals.count ?? 0).toLocaleString(),
        trend: data?.proposals.growth ?? 0,
      },
      {
        id: GovernanceTabs.VOTE_THROUGH_RATE,
        label: t('discover.voteThroughRate'),
        value: (data?.voteRate.count ?? 0).toLocaleString(),
        trend: data?.voteRate.growth ?? 0,
      },
    ];
  }, [
    data?.proposals.count,
    data?.proposals.growth,
    data?.voteRate.count,
    data?.voteRate.growth,
    t,
  ]);
  const [activeView, setActiveView] = useState<string>(items[0].id);

  const handleTopicSelect = useCallback(async (id: string) => {
    setChartData(null);
    setLeaderboardData(null);
    setActiveView(id);
  }, []);

  useMount(async () => {
    const response = await daoStatsService.getGovernance(CONTRACT);

    if (response.data) {
      setData(response.data);
    }
  });

  const [{ loading }, getChartData] = useAsyncFn(async () => {
    let chart;
    let leaders;

    switch (activeView) {
      case GovernanceTabs.VOTE_THROUGH_RATE: {
        chart = await daoStatsService.getGovernanceVoteRate(CONTRACT);
        leaders = await daoStatsService.getGovernanceVoteRateLeaderboard(
          CONTRACT
        );
        break;
      }
      case GovernanceTabs.NUMBER_OF_PROPOSALS:
      default: {
        chart = await daoStatsService.getGovernanceProposals(CONTRACT);
        leaders = await daoStatsService.getGovernanceProposalsLeaderboard(
          CONTRACT
        );
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
          valueLabel={getValueLabel(DaoStatsTopics.GOVERNANCE, activeView)}
        />
      </div>
    </div>
  );
};
