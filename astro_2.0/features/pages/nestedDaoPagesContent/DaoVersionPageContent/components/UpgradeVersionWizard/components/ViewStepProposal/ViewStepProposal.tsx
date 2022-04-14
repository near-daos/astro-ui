import React, { FC } from 'react';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { ProposalFeedItem } from 'types/proposal';
import { Button } from 'components/button/Button';

import styles from './ViewStepProposal.module.scss';

interface Props {
  isLastStep: boolean;
  canControlUpgrade: boolean;
  proposal: ProposalFeedItem;
  onApproved: () => Promise<void>;
  onRejected: () => Promise<void>;
}

export const ViewStepProposal: FC<Props> = ({
  isLastStep,
  canControlUpgrade,
  proposal,
  onApproved,
  onRejected,
}) => {
  const isApproved = proposal?.status === 'Approved';
  const isRejected = proposal?.status === 'Rejected';

  if (!proposal) {
    return null;
  }

  return (
    <div className={styles.root}>
      {isRejected && canControlUpgrade && (
        <div className={styles.headerControls}>
          <Button
            variant="tertiary"
            className={styles.resetButton}
            size="small"
            onClick={async () => {
              await onRejected();
            }}
          >
            Reset Steps
          </Button>
        </div>
      )}
      <ViewProposal
        proposal={proposal}
        showFlag={false}
        tokens={{}}
        preventNavigate
      />
      {isApproved && canControlUpgrade && (
        <Button
          className={styles.controlBtn}
          variant="black"
          onClick={async () => {
            if (isApproved) {
              await onApproved();
            } else {
              await onRejected();
            }
          }}
        >
          {isLastStep ? 'Finalise' : 'Next step'}
        </Button>
      )}
    </div>
  );
};
