import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAsyncFn, useMount } from 'react-use';
import InfiniteScroll from 'react-infinite-scroll-component';

import { TopListItem } from 'astro_2.0/features/Discover/components/DaosTopList/components/TopListItem';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import { getDaosList } from 'features/daos/helpers';

import { DaoFeedItem } from 'types/dao';

import styles from './DaosTopList.module.scss';

export const DaosTopList: FC = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<{ data: DaoFeedItem[]; total: number }>({
    data: [],
    total: 0,
  });

  const [, fetchData] = useAsyncFn(
    async (initData?: { data: DaoFeedItem[]; total: number }) => {
      let accumulatedListData = initData || null;

      const { daos, total } = await getDaosList({
        offset: initData ? initData.data.length : 0,
        sort: 'totalProposalCount,DESC',
        limit: 20,
      });

      accumulatedListData = {
        total,
        data: [...(accumulatedListData?.data || []), ...(daos || [])],
      };

      return accumulatedListData;
    },
    []
  );

  const getMoreDaos = useCallback(async () => {
    const newData = await fetchData(data);

    setData(newData);
  }, [data, fetchData]);

  useMount(() => {
    getMoreDaos();
  });

  return (
    <div className={styles.root}>
      {!data.data.length ? (
        <NoResultsView title="No data found" className={styles.noData} />
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.index} />
            <div className={styles.name}>{t('discover.daoName')}</div>
            <div className={styles.proposals}>
              {t('discover.numberOfProposals')}
            </div>
            <div className={styles.chart}>{t('discover.lastMonth')}</div>
          </div>
          <InfiniteScroll
            dataLength={data.data.length}
            next={getMoreDaos}
            hasMore={data.data.length < data.total}
            loader={<h4 className={styles.loading}>{t('loading')}...</h4>}
            style={{ overflow: 'initial' }}
            endMessage={
              <p className={styles.loading}>
                <b>{t('youHaveSeenItAll')}</b>
              </p>
            }
          >
            {data.data.map((item, i) => {
              return <TopListItem key={item.id} index={i} data={item} />;
            })}
          </InfiniteScroll>
        </>
      )}
    </div>
  );
};
