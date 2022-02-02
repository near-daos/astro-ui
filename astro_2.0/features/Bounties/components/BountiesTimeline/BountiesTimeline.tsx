import React, { FC, useCallback, useState } from 'react';

import { BountyContext } from 'types/bounties';
import {
  getGroupDateStart,
  getRangeColumns,
  getTimelineRange,
  getTopColumns,
  getTopColumnsWidth,
  prepareTimelineDataset,
} from 'astro_2.0/features/Bounties/components/BountiesTimeline/helpers';
import { DataRow } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/DataRow';
import { TimelineLegend } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/TimelineLegend';
import { TimelineRangeToggle } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/TimelineRangeToggle';
import { TimelineGranularity } from 'astro_2.0/features/Bounties/components/BountiesTimeline/types';
import { TimelineGroups } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/TimelineGroups';
import { TimelineHeader } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/TimelineHeader';

import styles from './BountiesTimeline.module.scss';

interface BountiesTimelineProps {
  data: BountyContext[];
}

export const BountiesTimeline: FC<BountiesTimelineProps> = ({ data }) => {
  const [dataset, setDataset] = useState(() => prepareTimelineDataset(data));
  const [min, max] = getTimelineRange(dataset);
  const [granularity, setGranularity] = useState<TimelineGranularity>('month');

  const topColumns = getTopColumns(min, max, granularity);

  const toggleGroup = useCallback(
    groupId => {
      const updatedDataSet = dataset.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            isOpen: !group.isOpen,
          };
        }

        return group;
      });

      setDataset(updatedDataSet);
    },
    [dataset]
  );

  return (
    <>
      <div className={styles.timelineControls}>
        <TimelineLegend />
        <TimelineRangeToggle
          onChange={val => setGranularity(val)}
          selected={granularity}
        />
      </div>
      <div className={styles.root}>
        <div className={styles.content}>
          <TimelineGroups dataset={dataset} toggleGroup={toggleGroup} />
          {topColumns.map(item => {
            const width = getTopColumnsWidth(item, granularity);
            const rangeColumns = getRangeColumns(item, granularity);

            return (
              <div
                key={item.toISOString()}
                className={styles.topColumn}
                style={{ width, minWidth: width }}
              >
                <TimelineHeader
                  item={item}
                  rangeColumns={rangeColumns}
                  granularity={granularity}
                />
                {dataset.map(group => {
                  const minDate = getGroupDateStart(group.minDate, granularity);
                  const maxDate = getGroupDateStart(group.maxDate, granularity);

                  return (
                    <React.Fragment key={group.id}>
                      <DataRow
                        data={group.milestones}
                        rangeColumns={rangeColumns}
                        granularity={granularity}
                        minDate={minDate}
                        maxDate={maxDate}
                      />
                      {group.isOpen &&
                        group.claims.length > 0 &&
                        group.claims.map(claim => {
                          const claimMinDate = getGroupDateStart(
                            claim.minDate,
                            granularity
                          );
                          const claimMaxDate = getGroupDateStart(
                            claim.maxDate,
                            granularity
                          );

                          return (
                            <DataRow
                              key={claim.id}
                              color={claim.color}
                              data={claim.milestones}
                              rangeColumns={rangeColumns}
                              granularity={granularity}
                              minDate={claimMinDate}
                              maxDate={claimMaxDate}
                            />
                          );
                        })}
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
