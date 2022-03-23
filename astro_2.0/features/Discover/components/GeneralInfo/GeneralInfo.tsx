import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAsyncFn, useMountedState } from 'react-use';

import { ControlTabs } from 'astro_2.0/features/Discover/components/ControlTabs';
import { DaosTopList } from 'astro_2.0/features/Discover/components/DaosTopList';
import { ChartRenderer } from 'astro_2.0/features/Discover/components/ChartRenderer';

import {
  LeaderboardData,
  TControlTab,
} from 'astro_2.0/features/Discover/types';
import { ChartDataElement } from 'components/AreaChartRenderer/types';

import { daoStatsService, LIMIT } from 'services/DaoStatsService';

import {
  CONTRACT,
  DaoStatsTopics,
  GeneralInfoTabs,
} from 'astro_2.0/features/Discover/constants';
import { getValueLabel } from 'astro_2.0/features/Discover/helpers';
import useQuery from 'hooks/useQuery';

import { General } from 'services/DaoStatsService/types';

import styles from './GeneralInfo.module.scss';

export const GeneralInfo: FC = () => {
  const isMounted = useMountedState();
  const { t } = useTranslation();
  const [generalData, setGeneralData] = useState<General | null>(null);
  const [chartData, setChartData] = useState<ChartDataElement[] | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardData[] | null
  >(null);
  const [limit, setLimit] = useState(LIMIT);

  const { query } = useQuery<{ dao: string }>();

  const items = useMemo<TControlTab[]>(() => {
    if (query.dao) {
      return [
        {
          id: GeneralInfoTabs.ACTIVITY,
          label: t('discover.activity'),
          value: (generalData?.activity.count ?? 0).toLocaleString(),
          trend: generalData?.activity.growth ?? 0,
        },
      ];
    }

    return [
      {
        id: GeneralInfoTabs.ACTIVE_DAOS,
        label: t('discover.activeDaos'),
        value: (generalData?.activity.count ?? 0).toLocaleString(),
        trend: generalData?.activity.growth ?? 0,
      },
    ];
  }, [generalData?.activity.count, generalData?.activity.growth, query.dao, t]);
  const [activeView, setActiveView] = useState(items[0].id);

  const handleTopicSelect = useCallback(
    async (id: string) => {
      if (!isMounted()) {
        return;
      }

      setChartData(null);
      setLeaderboardData(null);
      setActiveView(id);
    },
    [isMounted]
  );

  useEffect(() => {
    (async () => {
      const general = query.dao
        ? await daoStatsService.getGeneralDao({ ...CONTRACT, dao: query.dao })
        : await daoStatsService.getGeneral(CONTRACT);

      if (general.data && isMounted()) {
        setGeneralData(general.data);
      }
    })();
  }, [isMounted, query.dao]);

  const [{ loading }, getChartData] = useAsyncFn(async () => {
    let data;

    if (query.dao) {
      const params = {
        ...CONTRACT,
        dao: query.dao,
      };

      switch (activeView) {
        case GeneralInfoTabs.ACTIVITY:
        default: {
          data = await daoStatsService.getGeneralDaoActivity(params);
          break;
        }
      }
    } else {
      switch (activeView) {
        case GeneralInfoTabs.ACTIVE_DAOS:
        default: {
          data = await daoStatsService.getGeneralActive(CONTRACT);
          break;
        }
      }
    }

    if (data && isMounted()) {
      setChartData(
        data.data.metrics.map(({ timestamp, count }) => ({
          x: new Date(timestamp),
          y: count,
        }))
      );
    }
  }, [activeView, query.dao, isMounted]);

  const [, getLeaderboardData] = useAsyncFn(async () => {
    if (query.dao) {
      return;
    }

    let leadersData;

    switch (activeView) {
      case GeneralInfoTabs.ACTIVE_DAOS:
      default: {
        leadersData = await daoStatsService.getGeneralActiveLeaderboard({
          ...CONTRACT,
          limit,
        });
        break;
      }
    }

    if (leadersData?.data?.metrics && isMounted()) {
      setLeaderboardData(
        leadersData.data.metrics.map(metric => {
          return {
            ...metric,
            overview:
              metric.overview?.map(({ timestamp, count }) => ({
                x: new Date(timestamp),
                y: count,
              })) ?? [],
          };
        }) ?? null
      );
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
    <>
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
          valueLabel={getValueLabel(DaoStatsTopics.GENERAL_INFO, activeView)}
        />
      </div>
    </>
  );
};
