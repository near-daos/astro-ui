import React, { FC } from 'react';
import cn from 'classnames';
import { BountyStatus } from 'types/bounties';

import styles from './LegendItem.module.scss';

interface LegendItemProps {
  label: string;
  phase: BountyStatus;
}

export const LegendItem: FC<LegendItemProps> = ({ label, phase }) => (
  <div className={styles.root}>
    <span
      className={cn(styles.indicator, {
        [styles.available]: phase === BountyStatus.Available,
        [styles.inProgress]: phase === BountyStatus.InProgress,
        [styles.completed]: phase === BountyStatus.Completed,
      })}
    />
    <span className={styles.label}>{label}</span>
  </div>
);
