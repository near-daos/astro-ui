import React from 'react';

import cn from 'classnames';
import styles from './TimelineProgress.module.scss';

interface TimelineProgressProps {
  dashedView: boolean;
  indicator: boolean;
  className: string;
}

export const TimelineProgress: React.FC<TimelineProgressProps> = ({
  className,
  dashedView,
  indicator,
}) => {
  return (
    <div
      className={cn(styles.root, className, {
        [styles.finished]: !dashedView,
        [styles.inProgress]: dashedView,
        [styles.currentPhase]: indicator,
      })}
    />
  );
};
