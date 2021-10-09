import React, { FC, useCallback } from 'react';
import TextTruncate from 'react-text-truncate';
import { StatusPanel } from 'components/cards/bounty-card/components/status-panel/StatusPanel';
import { Bounty, BountyStatus } from 'components/cards/bounty-card/types';

import { useModal } from 'components/modal';
import { useBountyPageContext } from 'features/bounty/helpers';
import { ClaimBountyDialog } from 'features/bounty/dialogs/claim-bounty-dialog/ClaimBountyDialog';
import { UnclaimBountyDialog } from 'features/bounty/dialogs/unclaim-bounty-dialog/UnclaimBountyDialog';
import { CompleteBountyDialog } from 'features/bounty/dialogs/complete-bounty-dialog/CompleteBountyDialog';
import {
  InProgressCells,
  OpenCells
} from 'components/cards/bounty-card/components/cells';
import { format, parseISO } from 'date-fns';
import { formatYoktoValue } from 'helpers/format';
import ExternalLink from 'components/cards/components/external-link/ExternalLink';
import styles from './bounty-card.module.scss';

export interface BountyCardProps {
  data: Bounty;
  status: BountyStatus;
}

export const BountyCard: FC<BountyCardProps> = ({ data, status }) => {
  const { token, amount, description, claimedBy, slots, externalUrl } = data;
  const { dao } = useBountyPageContext();

  const amountValue = formatYoktoValue(amount);

  const [showClaimBountyDialog] = useModal(ClaimBountyDialog, {
    data,
    bond: dao.policy?.bountyBond
  });

  const [showUnclaimBountyDialog] = useModal(UnclaimBountyDialog, { data });

  const [showCompleteBountyDialog] = useModal(CompleteBountyDialog, {
    data,
    bond: dao.policy?.proposalBond
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

  const renderStatusBasedInfo = () => {
    switch (status) {
      case 'Open':
        return (
          <OpenCells
            claimed={claimedBy.length}
            slots={slots}
            onClaim={handleClaimClick}
          />
        );
      case 'In progress':
        return (
          <InProgressCells
            claimedBy={claimedBy}
            onUnclaim={handleUnclaimClick}
            onComplete={() => handleCompleteClick()}
          />
        );
      case 'Completed':
        return (
          <div>
            <span>Complete date</span>
            <span>
              {' '}
              {format(
                parseISO(data.completionDate ? data.completionDate : ''),
                'LL.d.yyyy-H.mm'
              )}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

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
          {externalUrl && (
            <div>
              <ExternalLink to={externalUrl} />
            </div>
          )}
        </div>
        <div className={styles.reward}>
          <span className={styles.value}>{amountValue}</span>
          &nbsp;
          <span className={styles.valueDesc}>{token}</span>
        </div>
        {renderStatusBasedInfo()}
      </div>
    </div>
  );
};
