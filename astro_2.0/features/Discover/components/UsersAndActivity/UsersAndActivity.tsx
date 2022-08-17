import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAsync, useMountedState } from 'react-use';

import { ControlTabs } from 'astro_2.0/features/Discover/components/ControlTabs';
import { ChartRenderer } from 'astro_2.0/features/Discover/components/ChartRenderer';
import { DaosTopList } from 'astro_2.0/features/Discover/components/DaosTopList';

import { TControlTab } from 'astro_2.0/features/Discover/types';

import { LIMIT } from 'services/DaoStatsService';
import { useDaoStatsContext } from 'astro_2.0/features/Discover/DaoStatsDataProvider';
import { getValueLabel } from 'astro_2.0/features/Discover/helpers';
import {
  CONTRACT,
  DaoStatsTopics,
  UsersAndActivityTabs,
} from 'astro_2.0/features/Discover/constants';
import { ChartInterval } from 'astro_2.0/features/Discover/components/ChartInterval';
import { useDiscoveryState } from 'astro_2.0/features/Discover/hooks';

import { dFormatter } from 'utils/format';
import useQuery from 'hooks/useQuery';

import { Interval, Users } from 'services/DaoStatsService/types';

import styles from './UsersAndActivity.module.scss';

export const UsersAndActivity: FC = () => {
  const isMounted = useMountedState();
  const [interval, setInterval] = useState(Interval.DAY);
  const { t } = useTranslation();
  const { daoStatsService } = useDaoStatsContext();
  const [data, setData] = useState<Users | null>(null);

  const { query } = useQuery<{ dao: string }>();

  const items = useMemo<TControlTab[]>(() => {
    if (query.dao) {
      return [
        {
          id: UsersAndActivityTabs.ACTIVE_USERS,
          label: t('discover.activeUsers'),
          value: (data?.activeUsers.count ?? 0).toLocaleString(),
          trend: data?.activeUsers.growth ?? 0,
        },
        {
          id: UsersAndActivityTabs.ALL_USERS_PER_DAO,
          label: t('discover.allUsersPerDao'),
          value: (data?.users.count ?? 0).toLocaleString(),
          trend: data?.users.growth ?? 0,
        },
        {
          id: UsersAndActivityTabs.USERS_MEMBERS_OF_DAO,
          label: t('discover.usersMembersOfDao'),
          value: (data?.members.count ?? 0).toLocaleString(),
          trend: data?.members.growth ?? 0,
        },
        {
          id: UsersAndActivityTabs.NUMBER_OF_INTERACTIONS,
          label: t('discover.numberOfInteractions'),
          value: Number(
            dFormatter(data?.interactions.count ?? 0, 2)
          ).toLocaleString(),
          trend: data?.interactions.growth ?? 0,
        },
      ];
    }

    return [
      {
        id: UsersAndActivityTabs.ACTIVE_USERS,
        label: t('discover.activeUsers'),
        value: (data?.activeUsers.count ?? 0).toLocaleString(),
        trend: data?.activeUsers.growth ?? 0,
      },
      {
        id: UsersAndActivityTabs.ALL_USERS_ON_PLATFORM,
        label: t('discover.allUsersOnAPlatform'),
        value: (data?.users.count ?? 0).toLocaleString(),
        trend: data?.users.growth ?? 0,
      },
      {
        id: UsersAndActivityTabs.USERS_MEMBERS_OF_DAO,
        label: t('discover.usersMembersOfDao'),
        value: (data?.members.count ?? 0).toLocaleString(),
        trend: data?.members.growth ?? 0,
      },
      {
        id: UsersAndActivityTabs.AVERAGE_NUMBER_OF_USERS_PER_DAO,
        label: t('discover.averageNumberOfUsersPerDao'),
        value: (data?.averageUsers.count ?? 0).toLocaleString(),
        trend: data?.averageUsers.growth ?? 0,
      },
      {
        id: UsersAndActivityTabs.NUMBER_OF_INTERACTIONS,
        label: t('discover.numberOfInteractions'),
        value: Number(
          dFormatter(data?.interactions.count ?? 0, 2)
        ).toLocaleString(),
        trend: data?.interactions.growth ?? 0,
      },
      {
        id: UsersAndActivityTabs.AVERAGE_NUMBER_OF_INTERACTIONS_PER_DAO,
        label: t('discover.averageNumberOfInteractionsPerDao'),
        value: Number(
          dFormatter(data?.averageInteractions.count ?? 0, 2)
        ).toLocaleString(),
        trend: data?.averageInteractions.growth ?? 0,
      },
    ];
  }, [
    data?.activeUsers.count,
    data?.activeUsers.growth,
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
    query.dao,
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
    activeView,
    setActiveView,
  } = useDiscoveryState(items);

  const handleTopicSelect = useCallback(
    async (id: string) => {
      if (!isMounted()) {
        return;
      }

      setActiveView(id);
    },
    [isMounted, setActiveView]
  );

  useEffect(() => {
    (async () => {
      const response = query.dao
        ? await daoStatsService.getUsersDao({ ...CONTRACT, dao: query.dao })
        : await daoStatsService.getUsers(CONTRACT);

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
        case UsersAndActivityTabs.ACTIVE_USERS: {
          chart = await daoStatsService.getUsersDaoActiveUsers({
            ...params,
            interval,
          });
          break;
        }
        case UsersAndActivityTabs.USERS_MEMBERS_OF_DAO: {
          chart = await daoStatsService.getUsersDaoMembers(params);
          break;
        }
        case UsersAndActivityTabs.NUMBER_OF_INTERACTIONS: {
          chart = await daoStatsService.getUsersDaoInteractions(params);
          break;
        }
        case UsersAndActivityTabs.ALL_USERS_ON_PLATFORM:
        default: {
          chart = await daoStatsService.getUsersDaoUsers(params);
          break;
        }
      }
    } else {
      switch (activeView) {
        case UsersAndActivityTabs.ACTIVE_USERS: {
          chart = await daoStatsService.getUsersActiveUsers({
            ...CONTRACT,
            interval,
          });
          break;
        }
        case UsersAndActivityTabs.USERS_MEMBERS_OF_DAO: {
          chart = await daoStatsService.getUsersMembers(CONTRACT);
          break;
        }
        case UsersAndActivityTabs.AVERAGE_NUMBER_OF_USERS_PER_DAO: {
          chart = await daoStatsService.getUsersAverageUsers(CONTRACT);
          break;
        }
        case UsersAndActivityTabs.NUMBER_OF_INTERACTIONS: {
          chart = await daoStatsService.getUsersInteractions(CONTRACT);
          break;
        }
        case UsersAndActivityTabs.AVERAGE_NUMBER_OF_INTERACTIONS_PER_DAO: {
          chart = await daoStatsService.getUsersAverageInteractions(CONTRACT);
          break;
        }
        case UsersAndActivityTabs.ALL_USERS_ON_PLATFORM:
        default: {
          chart = await daoStatsService.getUsersUsers(CONTRACT);
          break;
        }
      }
    }

    if (chart && isMounted()) {
      setChartData(
        chart.data.metrics.map(({ timestamp, count }) => ({
          x: new Date(timestamp),
          y: count,
        }))
      );
    }
  }, [interval, activeView, query.dao, isMounted]);

  useAsync(async () => {
    if (query.dao) {
      return;
    }

    let leaders;

    switch (activeView) {
      case UsersAndActivityTabs.USERS_MEMBERS_OF_DAO: {
        leaders = await daoStatsService.getUsersMembersLeaderboard({
          ...CONTRACT,
          offset,
        });
        break;
      }
      case UsersAndActivityTabs.NUMBER_OF_INTERACTIONS: {
        leaders = await daoStatsService.getUsersInteractionsLeaderboard({
          ...CONTRACT,
          offset,
        });
        break;
      }
      case UsersAndActivityTabs.ALL_USERS_ON_PLATFORM:
      default: {
        leaders = await daoStatsService.getUsersLeaderboard({
          ...CONTRACT,
          offset,
        });
        break;
      }
    }

    if (leaders?.data?.metrics && isMounted()) {
      const newData =
        leaders.data.metrics.map(metric => ({
          ...metric,
          overview:
            metric.overview?.map(({ timestamp, count }) => ({
              x: new Date(timestamp),
              y: count,
            })) ?? [],
        })) ?? null;

      setTotal(leaders.data.total);
      setLeaderboardData(
        leaderboardData ? [...leaderboardData, ...newData] : newData
      );
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
          data={chartData}
          loading={loading}
          activeView={activeView}
        />
        {activeView === UsersAndActivityTabs.ACTIVE_USERS && !loading ? (
          <ChartInterval
            interval={interval}
            setInterval={value => setInterval(value as Interval)}
          />
        ) : null}
        <DaosTopList
          total={total}
          next={nextLeaderboardItems}
          data={leaderboardData}
          valueLabel={getValueLabel(
            DaoStatsTopics.USERS_AND_ACTIVITY,
            activeView
          )}
        />
      </div>
    </div>
  );
};
