import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useDaosInfinite } from 'services/ApiService/hooks/useDaos';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

import { DaoFeedItem } from 'types/dao';

import { getSortOptions } from 'astro_3.0/features/DaosNext/helpers';
import { useRouterLoading } from 'hooks/useRouterLoading';

import { DaoDetailsGrid } from 'astro_2.0/components/DaoDetails';
import { SortMenu } from 'astro_3.0/components/SortMenu';
import { AdditionalDaosFilters } from './components/AdditionalDaosFilters';

import styles from './DaosNext.module.scss';

export const DaosNext: FC = () => {
  const { size, setSize, data, isValidating } = useDaosInfinite();
  const isLoading = useRouterLoading();
  const { t } = useTranslation();

  const handleLoadMore = useCallback(() => setSize(size + 1), [setSize, size]);

  const preparedData = useMemo(() => {
    return {
      data:
        data?.reduce<DaoFeedItem[]>((acc, item) => {
          acc.push(...item.data);

          return acc;
        }, []) ?? [],
      total: 0,
    };
  }, [data]);

  const hasMore = data
    ? data[data?.length - 1].data.length === LIST_LIMIT_DEFAULT
    : false;

  const dataLength = data?.length ?? 0;

  return (
    <main>
      <div className={styles.filtersWrapper}>
        <AdditionalDaosFilters />
        <SortMenu sortFieldName="sort" sortOptions={getSortOptions(t)} />
      </div>

      <InfiniteScroll
        dataLength={dataLength}
        next={handleLoadMore}
        hasMore={hasMore}
        loader={<h4 className={styles.loading}>{t('loading')}...</h4>}
        style={{ overflow: 'initial' }}
        endMessage={
          isValidating ? null : (
            <p className={styles.loading}>
              <b>{t('youHaveSeenItAll')}</b>
            </p>
          )
        }
      >
        <div className={styles.daosList}>
          {preparedData.data.map(item => {
            return (
              <DaoDetailsGrid
                loading={isLoading}
                key={item.id}
                dao={item}
                activeProposals={item.activeProposalCount}
                totalProposals={item.totalProposalCount}
              />
            );
          })}
        </div>
      </InfiniteScroll>
    </main>
  );
};
