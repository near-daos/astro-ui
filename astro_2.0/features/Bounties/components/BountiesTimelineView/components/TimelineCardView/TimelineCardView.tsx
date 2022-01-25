import React from 'react';
import cn from 'classnames';

import styles from './TimelineCardView.module.scss';

export interface TimelineStateContainerProps {
  className?: string;
}

export const TimelineCardView: React.FC<TimelineStateContainerProps> = ({
  className,
  children,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.status} />
      <div className={styles.body}>{children}</div>
    </div>
  );
};
