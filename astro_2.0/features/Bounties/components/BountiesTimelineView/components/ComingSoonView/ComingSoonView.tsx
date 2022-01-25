import { TimelineCardView } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/TimelineCardView/TimelineCardView';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import Link from 'next/link';
import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';
import { Icon } from 'components/Icon';
import React from 'react';
import styles from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/ComingSoonView/ComingSoonView.module.scss';
import { BountyStatus } from 'types/bounties';

interface ComingSoonView {
  proposer: string;
  daoId: string;
  proposalId: string;
}

export const ComingSoonStateRenderer: React.FC<ComingSoonView> = ({
  proposer,
  daoId,
  proposalId,
}) => {
  return (
    <div className={styles.proposed}>
      <TimelineCardView status={BountyStatus.Proposed}>
        <InfoBlockWidget
          label="Proposer"
          labelClassName={styles.label}
          value={proposer}
          valueClassName={styles.value}
        />

        <div className={styles.left}>
          <Link
            href={{
              pathname: SINGLE_PROPOSAL_PAGE_URL,
              query: {
                dao: daoId,
                proposal: proposalId,
              },
            }}
          >
            <a className={styles.proposalLink}>
              <Icon name="buttonExternal" className={styles.icon} />
              Link to the proposal
            </a>
          </Link>
        </div>
      </TimelineCardView>
    </div>
  );
};
