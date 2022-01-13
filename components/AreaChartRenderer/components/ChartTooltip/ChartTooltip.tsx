import cn from 'classnames';
import React, { useRef } from 'react';
import { TooltipProps } from 'recharts';
import { format } from 'date-fns';
import { DATE_FORMAT } from 'constants/timeConstants';
import { kFormatter } from 'utils/format';
import { Payload } from 'components/AreaChartRenderer/types';

import { Dot } from './dot';

import styles from './ChartTooltip.module.scss';

export interface ChartTooltipProps extends TooltipProps<number, string> {
  showArrow?: boolean;
  dataType?: string;
  payload: Payload[] | undefined;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  dataType,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className={cn(styles.tooltip)} ref={rootRef}>
      <p className={styles.label}>{format(new Date(label), DATE_FORMAT)}</p>
      {payload.map(element => (
        <div key={`item-${element.dataKey}-${element.value}`}>
          <Dot color={element.color || ''} className={styles.dot} />
          <span className={styles.value}>
            {kFormatter(Number(element.value?.toFixed(4)), 1)} {dataType}
          </span>
        </div>
      ))}
    </div>
  );
};
