import React, { FC } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';

import { dFormatter } from 'utils/format';

import styles from './StatPanel.module.scss';

interface StatPanelProps {
  title: string;
  value: string | number | undefined;
  trend: number | undefined;
  titleClassName?: string;
  trendClassName?: string;
  valueClassName?: string;
  className?: string;
}

export const StatPanel: FC<StatPanelProps> = ({
  title,
  value,
  titleClassName,
  className,
  trendClassName,
  valueClassName,
  trend = 0,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={cn(styles.title, titleClassName)}>{title}</div>
      <div
        className={cn(styles.trend, trendClassName, {
          [styles.positive]: trend >= 0,
          [styles.negative]: trend < 0,
        })}
      >
        {!!trend && (
          <Icon
            name={trend > 0 ? 'buttonArrowUp' : 'buttonArrowDown'}
            className={styles.trendIcon}
          />
        )}
        {dFormatter(Math.abs(trend), 2)}%
      </div>
      <div className={cn(styles.value, valueClassName)}>{value}</div>
    </div>
  );
};

export default StatPanel;
