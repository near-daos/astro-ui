import React, { FC } from 'react';

import { ClaimCard } from 'astro_2.0/features/ViewBounty/components/ClaimCard';
import { ClaimsStatistic } from 'astro_2.0/features/ViewBounty/components/ClaimsStatistic';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Bounty } from 'types/bounties';
import { CompleteProposalCard } from 'astro_2.0/features/ViewBounty/components/CompleteProposalCard/CompleteProposalCard';

import styles from './ClaimsInfo.module.scss';

interface ClaimsInfoProps {
  bounty: Bounty;
}

export const ClaimsInfo: FC<ClaimsInfoProps> = ({ bounty }) => {
  const hasClaims = bounty.bountyClaims.length > 0;
  const completedProposals = bounty.bountyDoneProposals.filter(
    item => item.status !== 'InProgress'
  );
  const hasCompletedProposals = completedProposals.length > 0;

  if (!hasClaims && !hasCompletedProposals) {
    return (
      <NoResultsView
        title="No claims were done yet"
        className={styles.noResults}
      />
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.column}>
        {bounty.bountyClaims.map(item => (
          <ClaimCard
            key={item.id}
            data={item}
            doneProposals={bounty.bountyDoneProposals}
            maxDeadline={bounty.maxDeadline}
          />
        ))}
        {completedProposals.map(item => (
          <CompleteProposalCard key={item.id} data={item} />
        ))}
      </div>
      <ClaimsStatistic
        claims={bounty.bountyClaims}
        doneProposals={bounty.bountyDoneProposals}
      />
    </div>
  );
};
