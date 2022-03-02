import React, { FC } from 'react';
import cn from 'classnames';

import { FlagRenderer } from 'astro_2.0/components/Flag';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { Icon } from 'components/Icon';
import { StatChart } from 'astro_2.0/features/DaoDashboard/components/StatChart';

import { DaoFeedItem } from 'types/dao';

import { shortenString } from 'utils/format';

import styles from './TopListItem.module.scss';

interface TopListItemProps {
  index: number;
  data: DaoFeedItem;
}

const chartData = [
  {
    x: new Date('2022-01-01'),
    y: 10,
  },
  {
    x: new Date('2022-01-05'),
    y: 30,
  },
  {
    x: new Date('2022-01-10'),
    y: 14,
  },
  {
    x: new Date('2022-01-20'),
    y: 45,
  },
  {
    x: new Date('2022-01-30'),
    y: 32,
  },
];

export const TopListItem: FC<TopListItemProps> = ({ index, data }) => {
  const {
    flagCover,
    flagLogo,
    logo,
    displayName,
    id,
    totalProposalCount,
  } = data;

  // todo - add trend to dao feed item
  const trend = 10;

  return (
    <div className={styles.root}>
      <div className={styles.index}>{index + 1}</div>
      <div className={styles.name}>
        <FlagRenderer
          flag={flagCover}
          logo={flagLogo}
          fallBack={logo}
          size="xs"
        />
        <div className={styles.details}>
          <div className={styles.daoName}>{displayName || id}</div>
          <div className={styles.address}>
            <div className={styles.addressId}>{shortenString(id, 36)}</div>
            <CopyButton
              text={id}
              tooltipPlacement="auto"
              className={styles.copyAddress}
            />
          </div>
        </div>
      </div>
      <div className={styles.proposals}>
        <div className={styles.value}>{totalProposalCount}</div>
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
        <StatChart data={chartData} />
      </div>
    </div>
  );
};
