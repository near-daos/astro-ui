import { Bounty } from 'types/bounties';
import React from 'react';
import { ClaimCard } from 'astro_2.0/features/ViewBounty/components/ClaimCard';

import styles from './InProgressBountyView.module.scss';

interface InProgressBountyViewProps {
  bounty: Bounty;
}

export const InProgressBountyView: React.FC<InProgressBountyViewProps> = ({
  bounty,
}) => {
  const { bountyClaims, bountyDoneProposals, maxDeadline } = bounty;

  return (
    <div className={styles.root}>
      {bountyClaims.map(claim => (
        <ClaimCard
          data={claim}
          doneProposals={bountyDoneProposals}
          maxDeadline={maxDeadline}
        />
      ))}
    </div>
  );
};
