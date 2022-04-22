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
import { useDaoStatsContext } from 'astro_2.0/features/Discover/DaoStatsDataProvider';
import { LIMIT } from 'services/DaoStatsService';

import { getValueLabel } from 'astro_2.0/features/Discover/helpers';
import {
  CONTRACT,
  DaoStatsTopics,
  GovernanceTabs,
} from 'astro_2.0/features/Discover/constants';
import useQuery from 'hooks/useQuery';

import { Governance as TGovernance } from 'services/DaoStatsService/types';
import { ONE_HUNDRED, PERCENT } from 'constants/common';

import styles from './Governance.module.scss';

export const Governance: FC = () => {
  const isMounted = useMountedState();
  const { t } = useTranslation();
  const { daoStatsService } = useDaoStatsContext();
  const [data, setData] = useState<TGovernance | null>(null);
  const [chartData, setChartData] = useState<ChartDataElement[] | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardData[] | null
  >(null);

  const { query } = useQuery<{ dao: string }>();

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
        value: `${Math.round(
          (data?.voteRate.count ?? 0) * ONE_HUNDRED
        ).toLocaleString()}%`,
        trend: data?.voteRate.growth ?? 0,
      },
      {
        id: GovernanceTabs.ACTIVE_PROPOSALS,
        label: t('discover.activeProposals'),
        value: (data?.activeProposals.count ?? 0).toLocaleString(),
        trend: data?.activeProposals.growth ?? 0,
      },
      {
        id: GovernanceTabs.ACTIVE_VOTES,
        label: t('discover.activeVotes'),
        value: (data?.activeVotes.count ?? 0).toLocaleString(),
        trend: data?.activeVotes.growth ?? 0,
      },
    ];
  }, [
    data?.proposals.count,
    data?.proposals.growth,
    data?.voteRate.count,
    data?.voteRate.growth,
    data?.activeVotes.count,
    data?.activeVotes.growth,
    data?.activeProposals.count,
    data?.activeProposals.growth,
    t,
  ]);
  const [activeView, setActiveView] = useState(items[0].id);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const handleTopicSelect = useCallback(
    async (id: string) => {
      if (!isMounted()) {
        return;
      }

      setChartData(null);
      setLeaderboardData(null);
      setOffset(0);
      setTotal(0);
      setActiveView(id);
    },
    [isMounted]
  );

  useEffect(() => {
    (async () => {
      const response = query.dao
        ? await daoStatsService.getGovernanceDao({
            ...CONTRACT,
            dao: query.dao,
          })
        : await daoStatsService.getGovernance(CONTRACT);

      if (response.data && isMounted()) {
        setData(response.data);
      }
    })();
  }, [query.dao, isMounted, daoStatsService]);

  const [{ loading }, getChartData] = useAsyncFn(async () => {
    let chart;

    if (query.dao) {
      const params = {
        ...CONTRACT,
        dao: query.dao,
      };

      switch (activeView) {
        case GovernanceTabs.ACTIVE_PROPOSALS: {
          chart = await daoStatsService.getGovernanceDaoActiveProposals(params);
          break;
        }
        case GovernanceTabs.ACTIVE_VOTES: {
          chart = await daoStatsService.getGovernanceDaoActiveVotes(params);
          break;
        }
        case GovernanceTabs.VOTE_THROUGH_RATE: {
          chart = await daoStatsService.getGovernanceDaoVoteRate(params);
          break;
        }
        case GovernanceTabs.NUMBER_OF_PROPOSALS:
        default: {
          chart = await daoStatsService.getGovernanceDaoProposals(params);
          break;
        }
      }
    } else {
      switch (activeView) {
        case GovernanceTabs.ACTIVE_PROPOSALS: {
          chart = await daoStatsService.getGovernanceActiveProposals(CONTRACT);
          break;
        }
        case GovernanceTabs.ACTIVE_VOTES: {
          chart = await daoStatsService.getGovernanceActiveVotes(CONTRACT);
          break;
        }
        case GovernanceTabs.VOTE_THROUGH_RATE: {
          chart = await daoStatsService.getGovernanceVoteRate(CONTRACT);
          break;
        }
        case GovernanceTabs.NUMBER_OF_PROPOSALS:
        default: {
          chart = await daoStatsService.getGovernanceProposals(CONTRACT);
          break;
        }
      }
    }

    if (chart && isMounted()) {
      let newData;

      if (activeView === GovernanceTabs.VOTE_THROUGH_RATE) {
        newData = chart.data.metrics.map(({ timestamp, count }) => ({
          x: new Date(timestamp),
          y: Math.round(count * ONE_HUNDRED),
        }));
      } else {
        newData = chart.data.metrics.map(({ timestamp, count }) => ({
          x: new Date(timestamp),
          y: count,
        }));
      }

      setChartData(newData);
    }
  }, [activeView, query.dao, isMounted]);

  const getUnit = () => {
    switch (activeView) {
      case GovernanceTabs.VOTE_THROUGH_RATE: {
        return PERCENT;
      }
      default:
        return '';
    }
  };

  const [, getLeaderboardData] = useAsyncFn(async () => {
    if (query.dao) {
      return;
    }

    let leaders;

    switch (activeView) {
      case GovernanceTabs.VOTE_THROUGH_RATE: {
        leaders = await daoStatsService.getGovernanceVoteRateLeaderboard({
          ...CONTRACT,
          offset,
        });
        break;
      }
      case GovernanceTabs.NUMBER_OF_PROPOSALS:
      default: {
        leaders = await daoStatsService.getGovernanceProposalsLeaderboard({
          ...CONTRACT,
          offset,
        });
        break;
      }
    }

    if (leaders?.data?.metrics && isMounted()) {
      let newData;

      if (activeView === GovernanceTabs.VOTE_THROUGH_RATE) {
        newData =
          leaders.data.metrics.map(metric => ({
            ...metric,
            overview:
              metric.overview?.map(({ timestamp, count }) => ({
                x: new Date(timestamp),
                y: Math.round(count * ONE_HUNDRED),
              })) ?? [],
          })) ?? null;
      } else {
        newData =
          leaders.data.metrics.map(metric => ({
            ...metric,
            overview:
              metric.overview?.map(({ timestamp, count }) => ({
                x: new Date(timestamp),
                y: count,
              })) ?? [],
          })) ?? null;
      }

      setTotal(leaders.data.total);
      setLeaderboardData(
        leaderboardData ? [...leaderboardData, ...newData] : newData
      );
    }
  }, [activeView, query.dao, isMounted, offset]);

  useEffect(() => {
    getChartData();
  }, [getChartData]);

  useEffect(() => {
    getLeaderboardData();
  }, [getLeaderboardData]);

  const nextLeaderboardItems = () => {
    setOffset(offset + LIMIT);
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
          unit={getUnit()}
          unitPosition="right"
          data={chartData}
          loading={loading}
          activeView={activeView}
        />
        <DaosTopList
          unit={getUnit()}
          unitPosition="right"
          total={total}
          next={nextLeaderboardItems}
          data={leaderboardData}
          valueLabel={getValueLabel(DaoStatsTopics.GOVERNANCE, activeView)}
        />
      </div>
    </div>
  );
};
