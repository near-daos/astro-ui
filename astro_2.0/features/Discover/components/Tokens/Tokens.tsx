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

import { daoStatsService } from 'services/DaoStatsService';

import { getValueLabel } from 'astro_2.0/features/Discover/helpers';
import {
  CONTRACT,
  DaoStatsTopics,
  TokensTabs,
} from 'astro_2.0/features/Discover/constants';
import useQuery from 'hooks/useQuery';

import { Tokens as TTokens } from 'services/DaoStatsService/types';

import styles from './Tokens.module.scss';

export const Tokens: FC = () => {
  const isMounted = useMountedState();
  const { t } = useTranslation();
  const [data, setData] = useState<TTokens | null>(null);
  const [chartData, setChartData] = useState<ChartDataElement[] | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardData[] | null
  >(null);

  const { query } = useQuery<{ dao: string }>();

  const items = useMemo<TControlTab[]>(() => {
    return [
      {
        id: TokensTabs.NUMBER_OF_FTS,
        label: t('discover.numberOfFts'),
        value: (data?.fts.count ?? 0).toLocaleString(),
        trend: data?.fts.growth ?? 0,
      },
      {
        id: TokensTabs.VL_OF_FTS,
        label: t('discover.vlOfFts'),
        value: (data?.ftsVl.count ?? 0).toLocaleString(),
        trend: data?.ftsVl.growth ?? 0,
      },
      {
        id: TokensTabs.NUMBER_OF_NFTS,
        label: t('discover.numberOfNfts'),
        value: (data?.nfts.count ?? 0).toLocaleString(),
        trend: data?.nfts.growth ?? 0,
      },
    ];
  }, [
    data?.fts.count,
    data?.fts.growth,
    data?.ftsVl.count,
    data?.ftsVl.growth,
    data?.nfts.count,
    data?.nfts.growth,
    t,
  ]);
  const [activeView, setActiveView] = useState<string>(items[0].id);

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
      const response = query.dao
        ? await daoStatsService.getTokensDao({ ...CONTRACT, dao: query.dao })
        : await daoStatsService.getTokens(CONTRACT);

      if (response.data && isMounted()) {
        setData(response.data);
      }
    })();
  }, [query.dao, isMounted]);

  const [{ loading }, getChartData] = useAsyncFn(async () => {
    let chart;
    let leaders;

    if (query.dao) {
      const params = {
        ...CONTRACT,
        dao: query.dao,
      };

      switch (activeView) {
        case TokensTabs.VL_OF_FTS: {
          chart = await daoStatsService.getTokensDaoFtsVl(params);
          break;
        }
        case TokensTabs.NUMBER_OF_NFTS: {
          chart = await daoStatsService.getTokensDaoNfts(params);
          break;
        }
        case TokensTabs.NUMBER_OF_FTS:
        default: {
          chart = await daoStatsService.getTokensDaoFts(params);
          break;
        }
      }
    } else {
      switch (activeView) {
        case TokensTabs.VL_OF_FTS: {
          chart = await daoStatsService.getTokensFtsVl(CONTRACT);
          leaders = await daoStatsService.getTokensFtsVlLeaderboard(CONTRACT);
          break;
        }
        case TokensTabs.NUMBER_OF_NFTS: {
          chart = await daoStatsService.getTokensNfts(CONTRACT);
          leaders = await daoStatsService.getTokensNftsLeaderboard(CONTRACT);
          break;
        }
        case TokensTabs.NUMBER_OF_FTS:
        default: {
          chart = await daoStatsService.getTokensFts(CONTRACT);
          leaders = await daoStatsService.getTokensFtsLeaderboard(CONTRACT);
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
  }, [activeView, query.dao, isMounted]);

  useEffect(() => {
    getChartData();
  }, [getChartData]);

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
          data={leaderboardData}
          valueLabel={getValueLabel(DaoStatsTopics.TOKENS, activeView)}
        />
      </div>
    </div>
  );
};
