import React, { FC } from 'react';
import cn from 'classnames';

// import { FlagRenderer } from 'astro_2.0/components/Flag';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { Icon } from 'components/Icon';
import { StatChart } from 'astro_2.0/features/DaoDashboard/components/StatChart';

import { LeaderboardData } from 'astro_2.0/features/Discover/types';

import { dFormatter, shortenString } from 'utils/format';

import styles from './TopListItem.module.scss';

interface TopListItemProps {
  index: number;
  data: LeaderboardData;
}

export const TopListItem: FC<TopListItemProps> = ({ index, data }) => {
  const { dao, activity, overview } = data;

  const trend = activity?.growth ?? 0;
  const value = activity?.count ?? 0;

  return (
    <div className={styles.root}>
      <div className={styles.index}>{index + 1}</div>
      <div className={styles.name}>
        {/* <FlagRenderer
          flag={flagCover}
          logo={flagLogo}
          fallBack={logo}
          size="xs"
        /> */}
        <div className={styles.details}>
          <div className={styles.daoName}>{dao}</div>
          <div className={styles.address}>
            <div className={styles.addressId}>{shortenString(dao, 36)}</div>
            <CopyButton
              text={dao}
              tooltipPlacement="auto"
              className={styles.copyAddress}
            />
          </div>
        </div>
      </div>
      <div className={styles.proposals}>
        <div className={styles.value}>
          {Number(dFormatter(value, 2)).toLocaleString()}
        </div>
        <div
          className={cn(styles.trend, {
            [styles.positive]: trend >= 0,
            [styles.negative]: trend < 0,
          })}
        >
          {!!trend && (
            <Icon
              name={trend > 0 ? 'buttonArrowUp' : 'buttonArrowDown'}
              className={styles.trendIcon}
            />
          )}
          {Math.abs(trend)}%
        </div>
      </div>
      <div className={styles.chart}>
        <StatChart data={overview} />
      </div>
    </div>
  );
};
