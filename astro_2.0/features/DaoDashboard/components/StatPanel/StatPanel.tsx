import React, { FC } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';

import styles from './StatPanel.module.scss';

interface StatPanelProps {
  title: string;
  value: string | number;
  trend: number;
}

export const StatPanel: FC<StatPanelProps> = ({ title, value, trend }) => {
  return (
    <div className={styles.root}>
      <div className={styles.title}>{title}</div>
      <div
        className={cn(styles.trend, {
          [styles.positive]: trend >= 0,
          [styles.negative]: trend < 0,
        })}
      >
        <Icon
          name={trend >= 0 ? 'buttonArrowUp' : 'buttonArrowDown'}
          className={styles.trendIcon}
        />
        {Math.abs(trend)}%
      </div>
      <div className={styles.value}>{value}</div>
    </div>
  );
};

export default StatPanel;
