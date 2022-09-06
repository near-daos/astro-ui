import React, { FC } from 'react';
import cn from 'classnames';

import { Tooltip } from 'astro_2.0/components/Tooltip';

import styles from './VotingPower.module.scss';

interface Props {
  progressPercent: number;
  inactiveVotingPower: boolean;
  className?: string;
  progressBarClassName?: string;
  showValue?: boolean;
}

export const VotingPower: FC<Props> = ({
  progressPercent,
  inactiveVotingPower,
  showValue = true,
  className,
  progressBarClassName,
}) => {
  return (
    <Tooltip
      placement="top"
      className={cn(styles.root, className)}
      overlay="Voting power"
    >
      {showValue && (
        <div className={styles.progressValue}>{progressPercent.toFixed()}%</div>
      )}
      <div className={cn(styles.progressBar, progressBarClassName)}>
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
