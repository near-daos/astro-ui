import React, { FC, useCallback } from 'react';
import TextTruncate from 'react-text-truncate';
import { StatusPanel } from 'components/cards/bounty-card/components/status-panel/StatusPanel';
import { Bounty } from 'components/cards/bounty-card/types';

import { useModal } from 'components/modal';
import { ClaimBountyDialog } from 'features/bounty/dialogs/claim-bounty-dialog/ClaimBountyDialog';
import { UnclaimBountyDialog } from 'features/bounty/dialogs/unclaim-bounty-dialog/UnclaimBountyDialog';
import { CompleteBountyDialog } from 'features/bounty/dialogs/complete-bounty-dialog/CompleteBountyDialog';
import {
  InProgressCells,
  OpenCells
} from 'components/cards/bounty-card/components/cells';
import styles from './bounty-card.module.scss';

export interface BountyCardProps {
  data: Bounty;
  inProgress: boolean;
}

export const BountyCard: FC<BountyCardProps> = ({ data, inProgress }) => {
  const { token, amount, description, claimedBy, slots } = data;

  const [showClaimBountyDialog] = useModal(ClaimBountyDialog, { data });

  const [showUnclaimBountyDialog] = useModal(UnclaimBountyDialog, { data });

  const [showCompleteBountyDialog] = useModal(CompleteBountyDialog, { data });

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
      <StatusPanel type="Passed" />
      <div className={styles.content}>
        <div className={styles.group}>
          <TextTruncate
            line={3}
            element="span"
            truncateText="…"
            text={description}
            textTruncateChild={null}
          />
        </div>
        <div className={styles.reward}>
          <span className={styles.value}>{amount}</span>
          &nbsp;
          <span className={styles.valueDesc}>{token}</span>
        </div>
        {inProgress ? (
          <InProgressCells
            claimedBy={claimedBy}
            onUnclaim={handleUnclaimClick}
            onComplete={() => handleCompleteClick()}
          />
        ) : (
          <OpenCells
            claimed={claimedBy.length}
            slots={slots}
            onClaim={handleClaimClick}
          />
        )}
      </div>
    </div>
  );
};
