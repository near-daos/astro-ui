import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { ProposalFeedItem } from 'types/proposal';
import { Button } from 'components/button/Button';
import { DaoWarning } from 'astro_2.0/components/DaoWarning';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

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
  const router = useRouter();
  const isApproved = proposal?.status === 'Approved';
  const isRejected = proposal?.status === 'Rejected';
  const isInProgress = proposal?.status === 'InProgress';

  if (!proposal) {
    return null;
  }

  const url = SINGLE_PROPOSAL_PAGE_URL.replace('[dao]', proposal.daoId).replace(
    '[proposal]',
    proposal.id || ''
  );
  const shareUrl = `${document.location?.origin}${url}`;

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
        preventNavigate
        // optionalPostVoteAction={onApproved}
      />
      {isInProgress && (
        <>
          <DaoWarning
            rootClassName={styles.infoRoot}
            statusClassName={styles.infoStatus}
            iconClassName={styles.infoIcon}
            className={styles.info}
            content={
              <>
                <div className={styles.title}>
                  Share this proposal link with your DAO council members for
                  approval:
                </div>

                <div className={styles.text}>
                  <span>{shareUrl}</span>
                  <CopyButton text={shareUrl} className={styles.copy} />
                </div>
              </>
            }
          />
          <Button
            className={styles.reload}
            variant="black"
            onClick={async () => {
              router.reload();
            }}
          >
            Reload
          </Button>
        </>
      )}
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
