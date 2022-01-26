import { BountyContext, BountyStatus } from 'types/bounties';
import React from 'react';

import { getBountyStatus } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/helpers';
import cn from 'classnames';

import { TimelineRow } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/TimelineRow';
import { TimelineProgress } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/TimelineProgress';
import { ComingSoonStateRenderer } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/ComingSoonView';
import { AvailabilityBountyView } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/AvailableBountyView';
import { InProgressBountyView } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/InProgressBountyView';
import { Token } from 'types/token';
import styles from './BountyTimeline.module.scss';

interface BountyTimelineProps {
  daoId: string;
  bountyContext: BountyContext;
  tokens: Record<string, Token>;
}

export const BountyTimeline: React.FC<BountyTimelineProps> = ({
  daoId,
  bountyContext,
  tokens,
}) => {
  const { proposal, bounty } = bountyContext;

  const bountyStatus = getBountyStatus(bountyContext);

  return (
    <TimelineRow
      comingSoonCell={
        <>
          <TimelineProgress
            progressCell={BountyStatus.Proposed}
            bountyStatus={bountyStatus}
            className={styles.padding}
          />
          {!bounty && (
            <ComingSoonStateRenderer
              daoId={daoId}
              proposer={proposal.proposer}
              proposalId={proposal.id}
            />
          )}
        </>
      }
      availableCell={
        <>
          <TimelineProgress
            progressCell={BountyStatus.Available}
            bountyStatus={bountyStatus}
            className={cn(styles.padding)}
          />
          {bounty && (
            <AvailabilityBountyView
              bountyName="name name"
              token={bounty.token === '' ? tokens.NEAR : tokens[bounty.token]}
              amount={bounty.amount}
              claimsOccupied={bounty.numberOfClaims}
              claimsAvailable={bounty.times}
            />
          )}
        </>
      }
      inProgressCell={
        <>
          <TimelineProgress
            bountyStatus={bountyStatus}
            progressCell={BountyStatus.InProgress}
          />
          {bountyStatus === BountyStatus.InProgress && (
            <InProgressBountyView bounty={bounty} />
          )}
        </>
      }
    />
  );
};
