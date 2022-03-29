import React, { FC } from 'react';

import styles from './StepCounter.module.scss';

interface StepCounterProps {
  total: number;
  current: number;
}

export const StepCounter: FC<StepCounterProps> = ({ total, current }) => {
  return (
    <div className={styles.root}>
      <span className={styles.current}>{current}</span>
      <span className={styles.total}>/{total}</span>
    </div>
  );
};
