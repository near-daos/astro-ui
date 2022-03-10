import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAsyncFn } from 'react-use';

import { ControlTabs } from 'astro_2.0/features/Discover/components/ControlTabs';
import { DaosTopList } from 'astro_2.0/features/Discover/components/DaosTopList';
import { ChartRenderer } from 'astro_2.0/features/Discover/components/ChartRenderer';

import {
  LeaderboardData,
  TControlTab,
} from 'astro_2.0/features/Discover/types';
import { ChartDataElement } from 'components/AreaChartRenderer/types';

import { daoStatsService } from 'services/DaoStatsService';

import {
  CONTRACT,
  DaoStatsTopics,
  GeneralInfoTabs,
} from 'astro_2.0/features/Discover/constants';
import { getValueLabel } from 'astro_2.0/features/Discover/helpers';
import { dFormatter } from 'utils/format';
import useQuery from 'hooks/useQuery';

import { General } from 'services/DaoStatsService/types';

import styles from './GeneralInfo.module.scss';

export const GeneralInfo: FC = () => {
  const { t } = useTranslation();
  const [generalData, setGeneralData] = useState<General | null>(null);
  const [chartData, setChartData] = useState<ChartDataElement[] | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardData[] | null
  >(null);

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
        {
          id: GeneralInfoTabs.GROUPS,
          label: t('discover.groups'),
          value: (generalData?.groups.count ?? 0).toLocaleString(),
          trend: generalData?.groups.growth ?? 0,
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
      {
        id: GeneralInfoTabs.NUMBER_OF_DAOS,
        label: t('discover.numberOfDaos'),
        value: (generalData?.dao.count ?? 0).toLocaleString(),
        trend: generalData?.dao.growth ?? 0,
      },
      {
        id: GeneralInfoTabs.GROUPS,
        label: t('discover.groups'),
        value: (generalData?.groups.count ?? 0).toLocaleString(),
        trend: generalData?.groups.growth ?? 0,
      },
      {
        id: GeneralInfoTabs.AVERAGE_GROUP_DAOS,
        label: t('discover.avgGroupDaos'),
        value: Number(
          dFormatter(generalData?.averageGroups.count ?? 0, 2)
        ).toLocaleString(),
        trend: generalData?.averageGroups.growth ?? 0,
      },
    ];
  }, [
    generalData?.activity.count,
    generalData?.activity.growth,
    generalData?.averageGroups.count,
    generalData?.averageGroups.growth,
    generalData?.dao.count,
    generalData?.dao.growth,
    generalData?.groups.count,
    generalData?.groups.growth,
    query.dao,
    t,
  ]);
  const [activeView, setActiveView] = useState<string>(items[0].id);

  const handleTopicSelect = useCallback(async (id: string) => {
    setChartData(null);
    setLeaderboardData(null);
    setActiveView(id);
  }, []);

  useEffect(() => {
    (async () => {
      const general = query.dao
        ? await daoStatsService.getGeneralDao({ ...CONTRACT, dao: query.dao })
        : await daoStatsService.getGeneral(CONTRACT);

      if (general.data) {
        setGeneralData(general.data);
      }
    })();
  }, [query.dao]);

  const [{ loading }, getChartData] = useAsyncFn(async () => {
    let data;
    let leadersData;

    if (query.dao) {
      const params = {
        ...CONTRACT,
        dao: query.dao,
      };

      switch (activeView) {
        case GeneralInfoTabs.GROUPS: {
          data = await daoStatsService.getGeneralDaoGroups(params);
          break;
        }
        case GeneralInfoTabs.ACTIVITY:
        default: {
          data = await daoStatsService.getGeneralDaoActivity(params);
          break;
        }
      }
    } else {
      switch (activeView) {
        case GeneralInfoTabs.NUMBER_OF_DAOS: {
          data = await daoStatsService.getGeneralDaos(CONTRACT);
          break;
        }
        case GeneralInfoTabs.GROUPS: {
          data = await daoStatsService.getGeneralGroups(CONTRACT);
          leadersData = await daoStatsService.getGeneralGroupsLeaderboard(
            CONTRACT
          );
          break;
        }
        case GeneralInfoTabs.AVERAGE_GROUP_DAOS: {
          data = await daoStatsService.getGeneralAverageGroups(CONTRACT);
          break;
        }
        case GeneralInfoTabs.ACTIVE_DAOS:
        default: {
          data = await daoStatsService.getGeneralActive(CONTRACT);
          leadersData = await daoStatsService.getGeneralActiveLeaderboard(
            CONTRACT
          );
          break;
        }
      }
    }

    if (data) {
      setChartData(
        data.data.metrics.map(({ timestamp, count }) => ({
          x: new Date(timestamp),
          y: count,
        }))
      );
    }

    if (leadersData?.data?.metrics) {
      const newData =
        leadersData.data.metrics.map(metric => {
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
  }, [activeView, query.dao]);

  useEffect(() => {
    getChartData();
  }, [getChartData]);

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
          data={leaderboardData}
          valueLabel={getValueLabel(DaoStatsTopics.GENERAL_INFO, activeView)}
        />
      </div>
    </>
  );
};
