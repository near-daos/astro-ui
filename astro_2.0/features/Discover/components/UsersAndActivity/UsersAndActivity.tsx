import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAsyncFn, useMount } from 'react-use';

import { ControlTabs } from 'astro_2.0/features/Discover/components/ControlTabs';
import { DashboardChart } from 'astro_2.0/features/DaoDashboard/components/DashboardChart';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { DaosTopList } from 'astro_2.0/features/Discover/components/DaosTopList';
import { Loader } from 'components/loader';

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
  UsersAndActivityTabs,
} from 'astro_2.0/features/Discover/helpers';
import { dFormatter } from 'utils/format';

import { Users } from 'services/DaoStatsService/types';

import styles from './UsersAndActivity.module.scss';

export const UsersAndActivity: FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<Users | null>(null);
  const [chartData, setChartData] = useState<ChartDataElement[] | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardData[] | null
  >(null);

  const items = useMemo<TControlTab[]>(() => {
    return [
      {
        id: UsersAndActivityTabs.ALL_USERS_ON_PLATFORM,
        label: t('discover.allUsersOnAPlatform'),
        value: `${data?.users.count ?? 0}`,
        trend: data?.users.growth ?? 0,
      },
      {
        id: UsersAndActivityTabs.USERS_MEMBERS_OF_DAO,
        label: t('discover.usersThatAreMembersOfADao'),
        value: `${data?.members.count ?? 0}`,
        trend: data?.members.growth ?? 0,
      },
      {
        id: UsersAndActivityTabs.AVERAGE_NUMBER_OF_USERS_PER_DAO,
        label: t('discover.averageNumberOfUsersPerDao'),
        value: `${data?.averageUsers.count ?? 0}`,
        trend: data?.averageUsers.growth ?? 0,
      },
      {
        id: UsersAndActivityTabs.NUMBER_OF_INTERACTIONS,
        label: t('discover.numberOfInteractions'),
        value: dFormatter(data?.interactions.count ?? 0, 2),
        trend: data?.interactions.growth ?? 0,
      },
      {
        id: UsersAndActivityTabs.AVERAGE_NUMBER_OF_INTERACTIONS_PER_DAO,
        label: t('discover.averageNumberOfInteractionsPerDao'),
        value: dFormatter(data?.averageInteractions.count ?? 0, 2),
        trend: data?.averageInteractions.growth ?? 0,
      },
    ];
  }, [
    data?.averageInteractions.count,
    data?.averageInteractions.growth,
    data?.averageUsers.count,
    data?.averageUsers.growth,
    data?.interactions.count,
    data?.interactions.growth,
    data?.members.count,
    data?.members.growth,
    data?.users.count,
    data?.users.growth,
    t,
  ]);
  const [activeView, setActiveView] = useState<string>(items[0].id);

  const handleTopicSelect = useCallback(async (id: string) => {
    setChartData(null);
    setLeaderboardData(null);
    setActiveView(id);
  }, []);

  useMount(async () => {
    const response = await daoStatsService.getUsers({ contract: CONTRACT });

    if (response.data) {
      setData(response.data);
    }
  });

  const [{ loading }, getChartData] = useAsyncFn(async () => {
    let chart;
    let leaders;

    switch (activeView) {
      case UsersAndActivityTabs.USERS_MEMBERS_OF_DAO: {
        chart = await daoStatsService.getUsersMembers({ contract: CONTRACT });
        leaders = await daoStatsService.getUsersMembersLeaderboard({
          contract: CONTRACT,
        });
        break;
      }
      case UsersAndActivityTabs.AVERAGE_NUMBER_OF_USERS_PER_DAO: {
        chart = await daoStatsService.getUsersAverageUsers({
          contract: CONTRACT,
        });
        break;
      }
      case UsersAndActivityTabs.NUMBER_OF_INTERACTIONS: {
        chart = await daoStatsService.getUsersInteractions({
          contract: CONTRACT,
        });
        leaders = await daoStatsService.getUsersInteractionsLeaderboard({
          contract: CONTRACT,
        });
        break;
      }
      case UsersAndActivityTabs.AVERAGE_NUMBER_OF_INTERACTIONS_PER_DAO: {
        chart = await daoStatsService.getUsersAverageInteractions({
          contract: CONTRACT,
        });
        break;
      }
      case UsersAndActivityTabs.ALL_USERS_ON_PLATFORM:
      default: {
        chart = await daoStatsService.getUsersUsers({ contract: CONTRACT });
        leaders = await daoStatsService.getUsersLeaderboard({
          contract: CONTRACT,
        });
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

  function renderChart() {
    if (chartData) {
      return (
        <DashboardChart
          key={activeView}
          activeView={activeView}
          data={chartData}
        />
      );
    }

    if (loading) {
      return <Loader />;
    }

    return <NoResultsView title="No data available" />;
  }

  return (
    <div className={styles.root}>
      <ControlTabs
        className={styles.header}
        items={items}
        onSelect={handleTopicSelect}
        activeView={activeView}
      />
      <div className={styles.body}>
        {renderChart()}
        <DaosTopList
          data={leaderboardData}
          valueLabel={getValueLabel(DaoStatsTopics.GENERAL_INFO, activeView)}
        />
      </div>
    </div>
  );
};
