import React, { FC, ReactNode, useCallback } from 'react';
import cn from 'classnames';
import { useMedia } from 'react-use';

import { CopyButton } from 'astro_2.0/components/CopyButton';
import { Icon } from 'components/Icon';
import { StatChart } from 'astro_2.0/features/DaoDashboard/components/StatChart';

import { LeaderboardData } from 'astro_2.0/features/Discover/types';

import { dFormatter, shortenString } from 'utils/format';
import useQuery from 'hooks/useQuery';
import { UnitPosition } from 'types/stats';

import styles from './TopListItem.module.scss';

interface TopListItemProps {
  index: number;
  data: LeaderboardData;
  unit?: string | ReactNode;
  unitPosition?: UnitPosition;
}

export const TopListItem: FC<TopListItemProps> = ({
  index,
  data,
  unit = '',
  unitPosition = 'left',
}) => {
  const { dao, activity, overview } = data;
  const isMobile = useMedia('(max-width: 640px)');

  const { updateQuery } = useQuery<{
    dao: string;
  }>({ shallow: true, scroll: true });

  const trend = activity?.growth ?? 0;
  const value = activity?.count ?? 0;

  const handleClick = useCallback(() => {
    updateQuery('dao', dao);
  }, [dao, updateQuery]);

  return (
    <div
      tabIndex={0}
      role="button"
      className={styles.root}
      onKeyPress={handleClick}
      onClick={handleClick}
    >
      <div className={styles.index}>{index + 1}</div>
      <div className={styles.name}>
        <div className={styles.details}>
          <div className={styles.daoName}>{dao}</div>
          <div className={styles.address}>
            <CopyButton
              text={dao}
              tooltipPlacement="auto"
              className={styles.copyAddress}
            >
              <div className={styles.addressId}>
                {shortenString(dao, isMobile ? 18 : 36)}
              </div>
            </CopyButton>
          </div>
        </div>
      </div>
      <div className={styles.proposals}>
        <div
          className={cn(styles.value, {
            [styles.right]: unitPosition === 'right',
          })}
        >
          <span>{unit && value !== 0 ? unit : null}</span>
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
