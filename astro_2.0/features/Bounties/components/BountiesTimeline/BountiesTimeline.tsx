import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { format } from 'date-fns';

import { BountyContext } from 'types/bounties';
import {
  formatColumnLabel,
  getGroupDateStart,
  getRangeColumns,
  getTimelineRange,
  getTopColumns,
  getTopColumnsWidth,
  prepareTimelineDataset,
} from 'astro_2.0/features/Bounties/components/BountiesTimeline/helpers';
import { Icon } from 'components/Icon';
import { DataRow } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/DataRow';

import styles from './BountiesTimeline.module.scss';

// 1. Prepare dataset: TimelineGroup[];
// 2. Get range: min and max date from all available data
// 3. Build columns array: from min to max
// 4. Build header and subheader
// 5. Iterate groups and build rows using columns array
// 6. Per each row find relevant milestones and put corresponding icon

interface BountiesTimelineProps {
  data: BountyContext[];
}

export const BountiesTimeline: FC<BountiesTimelineProps> = ({ data }) => {
  const [dataset, setDataset] = useState(() => prepareTimelineDataset(data));
  const [min, max] = getTimelineRange(dataset);
  const granularity = 'month';

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
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.groups}>
          <div className={styles.groupsHeader}>Name</div>
          {dataset.map(group => {
            return (
              <>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <div
                  key={group.id}
                  className={styles.group}
                  onClick={() => toggleGroup(group.id)}
                >
                  <div>
                    <Icon
                      className={styles.groupIcon}
                      name={group.isOpen ? 'buttonArrowUp' : 'buttonArrowDown'}
                    />
                  </div>
                  <div className={styles.groupName}>{group.name}</div>
                </div>
                {group.isOpen &&
                  group.claims.length > 0 &&
                  group.claims.map(claim => (
                    <div key={claim.id} className={styles.group}>
                      <div className={cn(styles.groupName, styles.claimName)}>
                        {claim.title}
                      </div>
                    </div>
                  ))}
              </>
            );
          })}
        </div>
        {topColumns.map(item => {
          const width = getTopColumnsWidth(item, granularity);
          const rangeColumns = getRangeColumns(item, granularity);

          return (
            <div
              className={styles.topColumn}
              style={{ width, minWidth: width }}
            >
              <div className={styles.topColumnLabel}>
                {format(item, 'dd MMM, yyyy')}
              </div>
              <div className={styles.subColumns}>
                {rangeColumns.map(columnDate => {
                  return (
                    <div className={cn(styles.column, styles.subColumn)}>
                      {formatColumnLabel(columnDate, granularity)}
                    </div>
                  );
                })}
              </div>
              {dataset.map(group => {
                const minDate = getGroupDateStart(group.minDate, granularity);
                const maxDate = getGroupDateStart(group.maxDate, granularity);

                return (
                  <>
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
                            data={claim.milestones}
                            rangeColumns={rangeColumns}
                            granularity={granularity}
                            minDate={claimMinDate}
                            maxDate={claimMaxDate}
                          />
                        );
                      })}
                  </>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
