import React from 'react';

import cn from 'classnames';
import { BountyStatus } from 'types/bounties';
import styles from './TimelineProgress.module.scss';

interface TimelineProgressProps {
  progressCell: BountyStatus;
  bountyStatus: BountyStatus;
  className?: string;
}

export const TimelineProgress: React.FC<TimelineProgressProps> = ({
  className,
  progressCell,
  bountyStatus,
}) => {
  const isPending =
    progressCell === bountyStatus || bountyStatus < progressCell;

  return (
    <div
      className={cn(styles.root, className, {
        [styles.solid]: !isPending,
        [styles.dashed]: isPending,
        [styles.indicator]: progressCell < bountyStatus,
        [styles.comingSoon]: bountyStatus === BountyStatus.Proposed,
        [styles.inProgress]: bountyStatus === BountyStatus.InProgress,
        [styles.available]: bountyStatus === BountyStatus.Available,
      })}
    />
  );
};
