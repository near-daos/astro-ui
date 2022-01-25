import { BountyContext, BountyStatus } from 'types/bounties';
import React from 'react';

import { ComingSoonStateRenderer } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/ComingSoonView/ComingSoonView';
import { AvailabilityBountyStateRenderer } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/AvailableBountyView/AvailableBountyView';
import { TimelineProgress } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/TimelineProgress/TimelineProgress';
import { TimelineRow } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/TimelineRow/TimelineRow';

import { getBountyStatus } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/helpers';
import cn from 'classnames';

import styles from './BountyTimeline.module.scss';

interface BountyTimelineProps {
  daoId: string;
  bountyContext: BountyContext;
}

export const BountyTimeline: React.FC<BountyTimelineProps> = ({
  daoId,
  bountyContext,
}) => {
  const { proposal, bounty } = bountyContext;

  const bountyStatus = getBountyStatus(bountyContext);

  const progressStyle = cn({
    [styles.available]: bountyStatus === BountyStatus.Available,
    [styles.comingSoon]: bountyStatus === BountyStatus.Proposed,
    [styles.inProgress]: bountyStatus === BountyStatus.InProgress,
  });

  return (
    <TimelineRow
      comingSoonCell={
        <div className={styles.cell}>
          <TimelineProgress
            dashedView={bountyStatus === BountyStatus.Proposed}
            indicator={bountyStatus === BountyStatus.Proposed}
            className={cn(styles.padding, progressStyle)}
          />

          {!bounty && (
            <ComingSoonStateRenderer
              daoId={daoId}
              proposer={proposal.proposer}
              proposalId={proposal.id}
            />
          )}
        </div>
      }
      availableCell={
        <div className={styles.cell}>
          {bounty && (
            <>
              <TimelineProgress
                dashedView={bountyStatus === BountyStatus.Available}
                indicator={bountyStatus === BountyStatus.Available}
                className={cn(styles.padding, progressStyle)}
              />
              <AvailabilityBountyStateRenderer
                bountyName="name name"
                claimsOccupied={3}
                claimsAvailable={5}
              />
            </>
          )}
        </div>
      }
      inProgressCell={
        bountyStatus === BountyStatus.InProgress && (
          <TimelineProgress
            dashedView={bountyStatus === BountyStatus.InProgress}
            indicator={bountyStatus === BountyStatus.InProgress}
            className={cn(progressStyle)}
          />
        )
      }
    />
  );
};
