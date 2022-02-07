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
  isGroupRow: boolean;
}

export const DataRow: FC<DataRowProps> = React.memo(
  ({
    data,
    rangeColumns,
    granularity,
    minDate,
    maxDate,
    color,
    isGroupRow,
  }) => {
    // const deadlineClaimMilestone = data.find(
    //   item => item.type === 'Claim Deadline'
    // );
    const approveClaimMilestone = data.find(
      item => item.type === 'Pending Approval'
    );
    const firstMilestone = data[0];
    const lastMilestone = data[data.length - 1];

    return (
      <div className={styles.dataColumns}>
        {rangeColumns.map((columnDate, i) => {
          const milestones = getMilestonesForDate(
            data,
            columnDate,
            granularity
          );
          const isEndOfPeriod = isEndOfGranularityPeriod(
            columnDate,
            granularity
          );

          const showTrack =
            minDate &&
            maxDate &&
            columnDate >= minDate &&
            columnDate <= maxDate;
          const showIncompleteTrack =
            !isGroupRow &&
            showTrack &&
            (!approveClaimMilestone || columnDate > approveClaimMilestone.date);

          const isFirstMilestone =
            firstMilestone &&
            showTrack &&
            milestones.length &&
            milestones[0].date === firstMilestone.date;
          const isLastMilestone =
            showTrack &&
            lastMilestone &&
            milestones.length &&
            milestones[milestones.length - 1].date === lastMilestone.date;

          return (
            <div
              /* eslint-disable-next-line react/no-array-index-key */
              key={i}
              data-milestone={milestones?.length > 0}
              style={{ color }}
              className={cn(styles.column, styles.dataColumn, {
                [styles.showTrack]: showTrack && !showIncompleteTrack,
                [styles.showIncompleteTrack]: showIncompleteTrack,
                [styles.lastColumn]: isEndOfPeriod,
                [styles.firstMilestone]: isFirstMilestone,
                [styles.lastMilestone]: isLastMilestone,
                [styles.singleMilestone]: isLastMilestone && isFirstMilestone,
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
  }
);
