import React from 'react';
import cn from 'classnames';

import styles from './TimelineHeader.module.scss';

interface TimelineHeaderCellProps {
  label: string;
  className: string;
}

export const TimelineHeaderCell: React.FC<TimelineHeaderCellProps> = ({
  label,
  className,
}) => {
  return <div className={cn(styles.root, className)}>{label}</div>;
};
