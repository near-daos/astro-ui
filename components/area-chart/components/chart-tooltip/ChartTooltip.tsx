import React, { FC } from 'react';
import format from 'date-fns/format';

import styles from './ChartTooltip.module.scss';

type TooltipProps = {
  x?: Date;
  y?: number;
};

interface ChartTooltipProps {
  data: TooltipProps;
}

const ChartTooltip: FC<ChartTooltipProps> = ({ data }) => {
  const date = data?.x ?? null;
  const value = data?.y ?? null;

  if (!date) return null;

  const formattedDate = format(date, 'EEEE, d.MM.yyyy');
  const formattedTime = format(date, 'HH:mm a');

  return (
    <div className={styles.root}>
      <div className={styles.group}>
        <div className={styles.date}>{formattedDate}</div>
        <div>&nbsp;</div>
        <div className={styles.time}>{formattedTime}</div>
      </div>
      {value && (
        <div className={styles.group}>
          <span className={styles.label}>Total Value:</span>
          <span className={styles.value}>{`${value.toLocaleString()}`}</span>
          <span>&nbsp;</span>
          <span className={styles.label}>USD</span>
        </div>
      )}
    </div>
  );
};

export default ChartTooltip;
