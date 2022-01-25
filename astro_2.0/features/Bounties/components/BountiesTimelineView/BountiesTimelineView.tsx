import { BountyContext } from 'types/bounties';

import React from 'react';
import { BountyTimeline } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/BountyTimeline/BountyTimeline';
import { TimelineRow } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/TimelineRow/TimelineRow';
import { TimelineHeaderCell } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/TimelineHeaderCell/TimelineHeaderCell';

import styles from './BountiesTimelineView.module.scss';

interface BountiesTimelineViewProps {
  daoId: string;
  bountiesContext: BountyContext[];
}

export const BountiesTimelineView: React.FC<BountiesTimelineViewProps> = ({
  daoId,
  bountiesContext,
}) => {
  return (
    <div>
      <TimelineRow
        availableCell={
          <TimelineHeaderCell label="Available" className={styles.available} />
        }
        comingSoonCell={
          <TimelineHeaderCell
            label="Coming soon"
            className={styles.comingSoon}
          />
        }
        inProgressCell={
          <TimelineHeaderCell
            label="In Progress"
            className={styles.inProgress}
          />
        }
      />
      {bountiesContext.map(bountyContext => (
        <BountyTimeline bountyContext={bountyContext} daoId={daoId} />
      ))}
    </div>
  );
};
