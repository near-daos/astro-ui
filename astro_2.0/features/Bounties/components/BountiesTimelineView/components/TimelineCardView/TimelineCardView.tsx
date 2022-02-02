import React from 'react';
import cn from 'classnames';

import { BountyStatus } from 'types/bounties';
import styles from './TimelineCardView.module.scss';

export interface TimelineStateContainerProps {
  className?: string;
  status: BountyStatus;
}

export const TimelineCardView: React.FC<TimelineStateContainerProps> = ({
  className,
  status,
  children,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div
        className={cn(styles.status, {
          [styles.comingSoon]: status === BountyStatus.Proposed,
          [styles.available]: status === BountyStatus.Available,
        })}
      />
      <div className={styles.body}>{children}</div>
    </div>
  );
};
