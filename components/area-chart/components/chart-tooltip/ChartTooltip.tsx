import React, { FC } from 'react';
import format from 'date-fns/format';
import { kFormatter } from 'helpers/format';
import { DATE_FORMAT, TIME_FORMAT } from 'constants/timeConstants';

import styles from './ChartTooltip.module.scss';

type TooltipProps = {
  x?: Date;
  y?: number;
};

interface ChartTooltipProps {
  data: TooltipProps;
  symbol: string;
}

const ChartTooltip: FC<ChartTooltipProps> = ({ data, symbol }) => {
  const date = data?.x ?? null;
  const value = data?.y ?? null;

  if (!date) return null;

  const formattedDate = format(date, DATE_FORMAT);
  const formattedTime = format(date, TIME_FORMAT);

  return (
    <div className={styles.root}>
      <div className={styles.group}>
        <div className={styles.date}>
          {formattedDate} {formattedTime}
        </div>
      </div>
      {!!value && (
        <div className={styles.group}>
          <span className={styles.label}>Total value:</span>
          <span className={styles.value}>{kFormatter(value)}</span>
          <span>&nbsp;</span>
          <span className={styles.value}>{symbol || 'NEAR'}</span>
        </div>
      )}
    </div>
  );
};

export default ChartTooltip;
