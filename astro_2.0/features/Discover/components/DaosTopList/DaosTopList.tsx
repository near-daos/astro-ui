import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { TopListItem } from 'astro_2.0/features/Discover/components/DaosTopList/components/TopListItem';

import { LeaderboardData } from 'astro_2.0/features/Discover/types';

import styles from './DaosTopList.module.scss';

interface DaosTopListProps {
  data: LeaderboardData[] | null;
  valueLabel: string;
}

export const DaosTopList: FC<DaosTopListProps> = ({ data, valueLabel }) => {
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
          <div className={styles.proposals}>{valueLabel}</div>
          <div className={styles.chart}>{t('discover.lastMonth')}</div>
        </div>
        {data.map((item, i) => {
          return <TopListItem key={item.dao} index={i} data={item} />;
        })}
      </>
    </div>
  );
};
