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
  TvlTabs,
} from 'astro_2.0/features/Discover/constants';
import { dFormatter } from 'utils/format';
import useQuery from 'hooks/useQuery';

import { Tvl as TTvl, TvlDao } from 'services/DaoStatsService/types';

import styles from './Tvl.module.scss';

export const Tvl: FC = () => {
  const isMounted = useMountedState();
  const { t } = useTranslation();
  const [data, setData] = useState<TTvl | TvlDao | null>(null);
  const [chartData, setChartData] = useState<ChartDataElement[] | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardData[] | null
  >(null);

  const { query } = useQuery<{ dao: string }>();
  const [limit, setLimit] = useState(LIMIT);
  const items = useMemo<TControlTab[]>(() => {
    if (query.dao) {
      const currentData = data as TvlDao;

      return [
        {
          id: TvlTabs.NUMBER_OF_BOUNTIES,
          label: t('discover.numberOfBounties'),
          value: Number(
            dFormatter(currentData?.bounties?.number.count ?? 0)
          ).toLocaleString(),
          trend: currentData?.bounties?.number.growth ?? 0,
        },
        {
          id: TvlTabs.VL_OF_BOUNTIES,
          label: t('discover.vlOfBounties'),
          value: Number(
            dFormatter(currentData?.bounties?.vl.count ?? 0)
          ).toLocaleString(),
          trend: currentData?.bounties?.vl.growth ?? 0,
        },
        {
          id: TvlTabs.TVL,
          label: t('discover.tvl'),
          value: Number(
            dFormatter(currentData?.tvl.count ?? 0)
          ).toLocaleString(),
          trend: currentData?.tvl.growth ?? 0,
        },
      ];
    }

    const currentData = data as TTvl;

    return [
      {
        id: TvlTabs.PLATFORM_TVL,
        label: t('discover.platformTvl'),
        value: Number(dFormatter(currentData?.tvl.count ?? 0)).toLocaleString(),
        trend: data?.tvl.growth ?? 0,
      },
      {
        id: TvlTabs.VL_IN_BOUNTIES,
        label: t('discover.vlInBountiesGrants'),
        value: Number(
          dFormatter(currentData?.bountiesAndGrantsVl?.count ?? 0)
        ).toLocaleString(),
        trend: currentData?.bountiesAndGrantsVl?.growth ?? 0,
      },
    ];
  }, [data, query.dao, t]);
  const [activeView, setActiveView] = useState(items[0].id);

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
        ? await daoStatsService.getTvlDao({ ...CONTRACT, dao: query.dao })
        : await daoStatsService.getTvl(CONTRACT);

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
        case TvlTabs.VL_OF_BOUNTIES: {
          chart = await daoStatsService.getTvlDaoBountiesVl(params);
          break;
        }
        case TvlTabs.TVL: {
          chart = await daoStatsService.getTvlDaoTvl(params);
          break;
        }
        case TvlTabs.NUMBER_OF_BOUNTIES:
        default: {
          chart = await daoStatsService.getTvlDaoBountiesNumber(params);
          break;
        }
      }
    } else {
      switch (activeView) {
        case TvlTabs.VL_IN_BOUNTIES: {
          chart = await daoStatsService.getTvlBountiesAndGrantsVl(CONTRACT);
          break;
        }
        case TvlTabs.PLATFORM_TVL:
        default: {
          chart = await daoStatsService.getTvlHistory(CONTRACT);
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
  }, [activeView, query.dao, isMounted]);

  const [, getLeaderboardData] = useAsyncFn(async () => {
    if (query.dao) {
      return;
    }

    let leaders;

    switch (activeView) {
      case TvlTabs.VL_IN_BOUNTIES: {
        leaders = await daoStatsService.getTvlBountiesAndGrantsVlLeaderboard({
          ...CONTRACT,
          limit,
        });
        break;
      }
      case TvlTabs.PLATFORM_TVL:
      default: {
        leaders = await daoStatsService.getTvlLeaderboard({
          ...CONTRACT,
          limit,
        });
        break;
      }
    }

    if (leaders?.data?.metrics && isMounted()) {
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
          valueLabel={getValueLabel(DaoStatsTopics.TVL, activeView)}
        />
      </div>
    </div>
  );
};
