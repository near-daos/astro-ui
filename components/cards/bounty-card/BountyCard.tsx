import React, { FC, useCallback } from 'react';
import TextTruncate from 'react-text-truncate';
import { StatusPanel } from 'components/cards/bounty-card/components/status-panel/StatusPanel';
import {
  OpenCells,
  InProgressCells,
  CompletedCells
} from 'components/cards/bounty-card/components/cells';
import { Bounty } from 'components/cards/bounty-card/types';
import { ClaimBountyDialog } from 'features/bounty/dialogs/claim-bounty-dialog/ClaimBountyDialog';
import { UnclaimBountyDialog } from 'features/bounty/dialogs/unclaim-bounty-dialog/UnclaimBountyDialog';
import { CompleteBountyDialog } from 'features/bounty/dialogs/complete-bounty-dialog/CompleteBountyDialog';
import { useModal } from 'components/modal';
import styles from './bounty-card.module.scss';

export interface BountyCardProps {
  data: Bounty;
}

export const BountyCard: FC<BountyCardProps> = ({ data }) => {
  const {
    type,
    status,
    token,
    amount,
    group,
    slots,
    claimed,
    claimedBy,
    claimedByMe,
    deadlineThreshold,
    deadlineUnit
  } = data;
  const [showClaimBountyDialog] = useModal(ClaimBountyDialog, {
    data
  });
  const [showUnclaimBountyDialog] = useModal(UnclaimBountyDialog, {
    data
  });
  const [showCompleteBountyDialog] = useModal(CompleteBountyDialog, {
    data
  });

  const handleClaimClick = useCallback(() => showClaimBountyDialog(), [
    showClaimBountyDialog
  ]);
  const handleUnclaimClick = useCallback(() => showUnclaimBountyDialog(), [
    showUnclaimBountyDialog
  ]);
  const handleCompleteClick = useCallback(() => showCompleteBountyDialog(), [
    showCompleteBountyDialog
  ]);

  return (
    <div className={styles.root}>
      <StatusPanel type={type} />
      <div className={styles.content}>
        <div className={styles.group}>
          <TextTruncate
            line={3}
            element="span"
            truncateText="…"
            text={group}
            textTruncateChild={null}
          />
        </div>
        <div className={styles.reward}>
          <span className={styles.value}>{amount}</span>
          &nbsp;
          <span className={styles.valueDesc}>{token}</span>
        </div>
        {status === 'Open' && (
          <OpenCells
            claimed={claimed}
            slots={slots}
            onClaim={handleClaimClick}
          />
        )}
        {status === 'In progress' && (
          <InProgressCells
            claimedBy={claimedBy}
            claimedByMe={claimedByMe}
            deadlineThreshold={deadlineThreshold}
            deadlineUnit={deadlineUnit}
            onUnclaim={handleUnclaimClick}
            onComplete={handleCompleteClick}
          />
        )}
        {status === 'Completed' && (
          <CompletedCells
            claimedBy={claimedBy}
            deadlineThreshold={deadlineThreshold}
            deadlineUnit={deadlineUnit}
          />
        )}
      </div>
    </div>
  );
};
