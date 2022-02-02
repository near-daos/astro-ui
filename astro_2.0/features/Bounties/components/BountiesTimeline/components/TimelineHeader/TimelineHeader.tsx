import React, { FC } from 'react';
import { format } from 'date-fns';
import cn from 'classnames';

import {
  formatColumnLabel,
  isEndOfGranularityPeriod,
} from 'astro_2.0/features/Bounties/components/BountiesTimeline/helpers';

import styles from 'astro_2.0/features/Bounties/components/BountiesTimeline/BountiesTimeline.module.scss';

import { TimelineGranularity } from 'astro_2.0/features/Bounties/components/BountiesTimeline/types';

interface TimelineHeaderProps {
  item: Date;
  rangeColumns: Date[];
  granularity: TimelineGranularity;
}

export const TimelineHeader: FC<TimelineHeaderProps> = ({
  item,
  rangeColumns,
  granularity,
}) => {
  const title = format(item, 'dd MMM, yyyy');

  return (
    <React.Fragment key={title}>
      <div className={styles.topColumnLabel}>{title}</div>
      <div className={styles.subColumns}>
        {rangeColumns.map(columnDate => {
          const isEndOfPeriod = isEndOfGranularityPeriod(
            columnDate,
            granularity
          );

          const columnTitle = formatColumnLabel(columnDate, granularity);

          return (
            <div
              key={columnDate.toISOString()}
              className={cn(styles.column, styles.subColumn, {
                [styles.lastColumn]: isEndOfPeriod,
              })}
            >
              {columnTitle}
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};
