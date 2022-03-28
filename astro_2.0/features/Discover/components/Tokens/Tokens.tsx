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
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

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
  const [activeView, setActiveView] = useState(items[0].id);

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
        ? await daoStatsService.getTokensDao({ ...CONTRACT, dao: query.dao })
        : await daoStatsService.getTokens(CONTRACT);

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
          break;
        }
        case TokensTabs.NUMBER_OF_NFTS: {
          chart = await daoStatsService.getTokensNfts(CONTRACT);
          break;
        }
        case TokensTabs.NUMBER_OF_FTS:
        default: {
          chart = await daoStatsService.getTokensFts(CONTRACT);
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
      case TokensTabs.VL_OF_FTS: {
        leaders = await daoStatsService.getTokensFtsVlLeaderboard({
          ...CONTRACT,
          offset,
        });
        break;
      }
      case TokensTabs.NUMBER_OF_NFTS: {
        leaders = await daoStatsService.getTokensNftsLeaderboard({
          ...CONTRACT,
          offset,
        });
        break;
      }
      case TokensTabs.NUMBER_OF_FTS:
      default: {
        leaders = await daoStatsService.getTokensFtsLeaderboard({
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
          data={chartData}
          loading={loading}
          activeView={activeView}
        />
        <DaosTopList
          total={total}
          next={nextLeaderboardItems}
          data={leaderboardData}
          valueLabel={getValueLabel(DaoStatsTopics.TOKENS, activeView)}
        />
      </div>
    </div>
  );
};