import React, { FC } from 'react';
import cn from 'classnames';

import { Tooltip } from 'astro_2.0/components/Tooltip';

import styles from './VotingPower.module.scss';

interface Props {
  progressPercent: number;
  inactiveVotingPower: boolean;
}

export const VotingPower: FC<Props> = ({
  progressPercent,
  inactiveVotingPower,
}) => {
  return (
    <Tooltip placement="top" className={styles.root} overlay="Voting power">
      <div className={styles.progressValue}>{progressPercent.toFixed()}%</div>
      <div className={styles.progressBar}>
        <div
          className={cn(styles.progress, {
            [styles.inactive]: inactiveVotingPower,
          })}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </Tooltip>
  );
};
