import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'next-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import uniqid from 'uniqid';

import { TopListItem } from 'astro_2.0/features/Discover/components/DaosTopList/components/TopListItem';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { LeaderboardData } from 'astro_2.0/features/Discover/types';
import { UnitPosition } from 'types/stats';

import styles from './DaosTopList.module.scss';

interface DaosTopListProps {
  total: number;
  data: LeaderboardData[] | null;
  valueLabel: string;
  next: () => void;
  unit?: string | ReactNode;
  unitPosition?: UnitPosition;
}

export const DaosTopList: FC<DaosTopListProps> = ({
  total,
  data,
  valueLabel,
  next,
  unit = '',
  unitPosition = 'left',
}) => {
  const { t } = useTranslation();

  if (!data) {
    return null;
  }

  return (
    <div className={styles.root}>
      <>
        <div className={styles.header}>
          <div className={styles.index}>&nbsp;</div>
          <div className={styles.name}>{t('discover.daoName')}</div>
          <div className={styles.proposals}>
            {valueLabel === '-' ? '-' : t(`discover.${valueLabel}`)}
          </div>
          <div className={styles.chart}>{t('discover.lastMonth')}</div>
        </div>
        <InfiniteScroll
          dataLength={data.length}
          next={next}
          hasMore={data.length < total}
          loader={
            <div className={styles.loadingMore}>
              <LoadingIndicator />
            </div>
          }
          style={{ overflow: 'initial' }}
          endMessage=""
        >
          {data.map((item, i) => (
            <TopListItem
              key={uniqid()}
              unitPosition={unitPosition}
              index={i}
              data={item}
              unit={unit}
            />
          ))}
        </InfiniteScroll>
      </>
    </div>
  );
};
