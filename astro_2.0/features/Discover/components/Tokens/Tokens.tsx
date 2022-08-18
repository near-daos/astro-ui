import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAsync, useMountedState } from 'react-use';

import { ControlTabs } from 'astro_2.0/features/Discover/components/ControlTabs';
import { ChartRenderer } from 'astro_2.0/features/Discover/components/ChartRenderer';
import { DaosTopList } from 'astro_2.0/features/Discover/components/DaosTopList';

import { TControlTab } from 'astro_2.0/features/Discover/types';
import { useDaoStatsContext } from 'astro_2.0/features/Discover/DaoStatsDataProvider';
import { LIMIT } from 'services/DaoStatsService';

import { getValueLabel } from 'astro_2.0/features/Discover/helpers';
import {
  CONTRACT,
  DaoStatsTopics,
  TokensTabs,
} from 'astro_2.0/features/Discover/constants';
import useQuery from 'hooks/useQuery';
import { USD } from 'constants/common';
import { useDiscoveryState } from 'astro_2.0/features/Discover/hooks';

import { Tokens as TTokens } from 'services/DaoStatsService/types';

import styles from './Tokens.module.scss';

export const Tokens: FC = () => {
  const isMounted = useMountedState();
  const { t } = useTranslation();
  const { daoStatsService } = useDaoStatsContext();
  const [data, setData] = useState<TTokens | null>(null);
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
        value: `${data?.ftsVl.count ? USD : ''}${(
          data?.ftsVl.count ?? 0
        ).toLocaleString()}`,
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
  const {
    setOffset,
    setTotal,
    total,
    offset,
    leaderboardData,
    setLeaderboardData,
    chartData,
    setChartData,
    setActiveView,
    activeView,
  } = useDiscoveryState(items);

  const handleTopicSelect = useCallback(
    async (id: string) => {
      if (!isMounted()) {
        return;
      }

      setActiveView(id);
    },
    [setActiveView, isMounted]
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
  }, [query.dao, isMounted, daoStatsService]);

  const { loading } = useAsync(async () => {
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

  const unit = useMemo(() => {
    switch (activeView) {
      case TokensTabs.VL_OF_FTS: {
        return USD;
      }
      default:
        return '';
    }
  }, [activeView]);

  useAsync(async () => {
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
          unit={unit}
          data={chartData}
          loading={loading}
          activeView={activeView}
        />
        <DaosTopList
          unit={unit}
          total={total}
          next={nextLeaderboardItems}
          data={leaderboardData}
          valueLabel={getValueLabel(DaoStatsTopics.TOKENS, activeView)}
        />
      </div>
    </div>
  );
};
