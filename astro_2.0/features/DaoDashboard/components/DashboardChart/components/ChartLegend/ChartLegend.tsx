import React, { FC } from 'react';
import cn from 'classnames';

import styles from './ChartLegend.module.scss';

interface ChartLegendProps {
  label: string;
  className?: string;
}

export const ChartLegend: FC<ChartLegendProps> = ({ label, className }) => {
  return (
    <div className={styles.root}>
      <span className={cn(styles.legendIndicator, className)} />
      <span className={styles.legendLabel}>{label}</span>
    </div>
  );
};
