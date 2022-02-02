import React, { FC } from 'react';
import cn from 'classnames';

import {
  getMilestonesForDate,
  isEndOfGranularityPeriod,
} from 'astro_2.0/features/Bounties/components/BountiesTimeline/helpers';
import { Milestone } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/Milestone';
import { StackedMilestones } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/StackedMilestones';
import {
  TimelineGranularity,
  TimelineMilestone,
} from 'astro_2.0/features/Bounties/components/BountiesTimeline/types';

import styles from 'astro_2.0/features/Bounties/components/BountiesTimeline/BountiesTimeline.module.scss';

interface DataRowProps {
  data: TimelineMilestone[];
  rangeColumns: Date[];
  granularity: TimelineGranularity;
  minDate: Date | null;
  maxDate: Date | null;
  color?: string;
}

export const DataRow: FC<DataRowProps> = ({
  data,
  rangeColumns,
  granularity,
  minDate,
  maxDate,
  color,
}) => {
  return (
    <div className={styles.dataColumns}>
      {rangeColumns.map((columnDate, i) => {
        const milestones = getMilestonesForDate(data, columnDate, granularity);
        const isEndOfPeriod = isEndOfGranularityPeriod(columnDate, granularity);

        const showTrack =
          minDate && maxDate && columnDate > minDate && columnDate < maxDate;

        return (
          <div
            /* eslint-disable-next-line react/no-array-index-key */
            key={i}
            style={{ color }}
            className={cn(styles.column, styles.dataColumn, {
              [styles.showTrack]: showTrack,
              [styles.lastColumn]: isEndOfPeriod,
            })}
          >
            {milestones && milestones.length === 1 && (
              <Milestone data={milestones[0]} color={milestones[0].color} />
            )}
            {milestones && milestones.length > 1 && (
              <StackedMilestones data={milestones} />
            )}
          </div>
        );
      })}
    </div>
  );
};
