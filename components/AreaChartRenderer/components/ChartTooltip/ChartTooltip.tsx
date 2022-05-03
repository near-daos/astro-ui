import cn from 'classnames';
import React, { ReactNode, useRef } from 'react';
import { TooltipProps } from 'recharts';
import { format } from 'date-fns';
import { DATE_FORMAT } from 'constants/timeConstants';
import { kFormatter } from 'utils/format';
import { Payload } from 'components/AreaChartRenderer/types';
import { UnitPosition } from 'types/stats';

import { Dot } from './dot';

import styles from './ChartTooltip.module.scss';

export interface ChartTooltipProps extends TooltipProps<number, string> {
  showArrow?: boolean;
  payload: Payload[] | undefined;
  isIntegerDataset?: boolean;
  unit?: string | ReactNode;
  unitPosition?: UnitPosition;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  isIntegerDataset = false,
  unit = '',
  unitPosition = 'left',
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className={styles.tooltip} ref={rootRef}>
      <p className={styles.label}>{format(new Date(label), DATE_FORMAT)}</p>
      {payload.map(element => (
        <div
          key={`item-${element.dataKey}-${element.value}`}
          className={styles.element}
        >
          <Dot color={element.color || ''} className={styles.dot} />
          <span
            className={cn(styles.value, {
              [styles.right]: unitPosition === 'right',
            })}
          >
            <span>{element.value !== 0 ? unit : null}</span>
            <span>
              {kFormatter(
                Number(element.value?.toFixed(4)),
                isIntegerDataset ? 0 : 1
              )}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};
