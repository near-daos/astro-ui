import { BountyContext } from 'types/bounties';

import React from 'react';

import { TimelineRow } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/TimelineRow';
import { TimelineHeaderCell } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/TimelineHeaderCell';
import { BountyTimeline } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/BountyTimeline';

import { Token } from 'types/token';
import styles from './BountiesTimelineView.module.scss';

interface BountiesTimelineViewProps {
  daoId: string;
  bountiesContext: BountyContext[];
  tokens: Record<string, Token>;
}

export const BountiesTimelineView: React.FC<BountiesTimelineViewProps> = ({
  daoId,
  bountiesContext,
  tokens,
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
        <BountyTimeline
          bountyContext={bountyContext}
          daoId={daoId}
          tokens={tokens}
        />
      ))}
    </div>
  );
};
