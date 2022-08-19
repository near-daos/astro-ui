import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { BountyContext } from 'types/bounties';
import {
  getGroupDateStart,
  getRangeColumns,
  getTimelineRange,
  getTopColumns,
  prepareTimelineDataset,
} from 'astro_2.0/features/Bounties/components/BountiesTimeline/helpers';
import { DataRow } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/DataRow';
import { TimelineLegend } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/TimelineLegend';
import { TimelineRangeToggle } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/TimelineRangeToggle';
import {
  TimelineGranularity,
  TimelineGroup,
} from 'astro_2.0/features/Bounties/components/BountiesTimeline/types';
import { TimelineGroups } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/TimelineGroups';
import { TimelineHeader } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/TimelineHeader';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import useQuery from 'hooks/useQuery';

import styles from './BountiesTimeline.module.scss';

interface BountiesTimelineProps {
  data: BountyContext[];
}

export const BountiesTimeline: FC<BountiesTimelineProps> = ({ data }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { query } = useQuery<{
    bountyFilter: string;
    bountySort: string;
  }>({ shallow: false });
  const [dataset, setDataset] = useState<TimelineGroup[]>([]);
  const [granularity, setGranularity] = useState<TimelineGranularity>('month');
  const [min, max] = useMemo(() => getTimelineRange(dataset), [dataset]);
  const topColumns = useMemo(
    () => getTopColumns(min, max, granularity),
    [granularity, max, min]
  );

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

  const toggleRange = useCallback(val => {
    setGranularity(val);
  }, []);

  useEffect(() => {
    // We want milestone to be visible on load
    if (contentRef.current) {
      const container = contentRef.current;
      const milestone = document.querySelector(
        '[data-milestone]'
      ) as HTMLDivElement;

      if (milestone && container) {
        container.scrollLeft = milestone.offsetLeft + 64;
      }
    }
  }, []);

  useEffect(() => {
    setDataset(prepareTimelineDataset(data));
  }, [data, query]);

  if (!dataset.length) {
    return <NoResultsView title="No results found" />;
  }

  return (
    <>
      <div className={styles.timelineControls}>
        <TimelineLegend />
        <TimelineRangeToggle onChange={toggleRange} selected={granularity} />
      </div>
      <div className={styles.root}>
        <div className={styles.content} ref={contentRef}>
          <TimelineGroups dataset={dataset} toggleGroup={toggleGroup} />
          {topColumns.map((item, i) => {
            const rangeColumns = getRangeColumns(item, granularity);

            return (
              <div
                /* eslint-disable-next-line react/no-array-index-key */
                key={i}
                className={styles.topColumn}
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
                        isGroupRow
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
                              isGroupRow={false}
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
