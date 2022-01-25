import React, { FC } from 'react';

import { ClaimCard } from 'astro_2.0/features/ViewBounty/components/ClaimCard';
import { ClaimsStatistic } from 'astro_2.0/features/ViewBounty/components/ClaimsStatistic';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import { Bounty } from 'types/bounties';

import styles from './ClaimsInfo.module.scss';

interface ClaimsInfoProps {
  bounty: Bounty;
}

export const ClaimsInfo: FC<ClaimsInfoProps> = ({ bounty }) => {
  if (!bounty.bountyClaims.length) {
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
      </div>
      <ClaimsStatistic
        claims={bounty.bountyClaims}
        doneProposals={bounty.bountyDoneProposals}
      />
    </div>
  );
};
