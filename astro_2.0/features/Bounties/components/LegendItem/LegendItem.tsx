import React, { FC } from 'react';
import cn from 'classnames';
import { BountiesPhase } from 'types/bounties';

import styles from './LegendItem.module.scss';

interface LegendItemProps {
  label: string;
  phase: BountiesPhase;
}

export const LegendItem: FC<LegendItemProps> = ({ label, phase }) => (
  <div className={styles.root}>
    <span
      className={cn(styles.indicator, {
        [styles.available]: phase === BountiesPhase.Available,
        [styles.inProgress]: phase === BountiesPhase.InProgress,
        [styles.completed]: phase === BountiesPhase.Completed,
      })}
    />
    <span className={styles.label}>{label}</span>
  </div>
);
