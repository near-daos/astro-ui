import React, { FC } from 'react';

import styles from './VotingPower.module.scss';

interface Props {
  progressPercent: number;
}

export const VotingPower: FC<Props> = ({ progressPercent }) => {
  return (
    <div className={styles.root}>
      <div className={styles.progressValue}>{progressPercent.toFixed()}%</div>
      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
