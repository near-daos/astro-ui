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
import ExternalLink from 'components/cards/components/external-link/ExternalLink';
import { useRouter } from 'next/router';
import { TokenWidget } from 'components/token';
import styles from './bounty-card.module.scss';

export interface BountyCardProps {
  data: Bounty;
  status: BountyStatus;
}

export const BountyCard: FC<BountyCardProps> = ({ data, status }) => {
  const { tokenId, amount, description, claimedBy, slots, externalUrl } = data;
  const { dao, tokens } = useBountyPageContext();
  const router = useRouter();

  const tokenIndex = Object.values(tokens).findIndex(
    daoToken => daoToken.tokenId === tokenId
  );

  const token =
    tokenIndex === -1 ? tokens.NEAR : Object.values(tokens)[tokenIndex];

  const [showClaimBountyDialog] = useModal(ClaimBountyDialog, {
    data,
    dao,
    token
  });

  const [showUnclaimBountyDialog] = useModal(UnclaimBountyDialog, {
    data,
    dao,
    token
  });

  const [showCompleteBountyDialog] = useModal(CompleteBountyDialog, {
    data,
    dao,
    token
  });

  const handleClaimClick = useCallback(() => showClaimBountyDialog(), [
    showClaimBountyDialog
  ]);
  const handleUnclaimClick = useCallback(() => showUnclaimBountyDialog(), [
    showUnclaimBountyDialog
  ]);
  const handleCompleteClick = useCallback(async () => {
    const result = await showCompleteBountyDialog();

    if (result.includes('submitted')) {
      router.push(`/dao/${dao?.id}`);
    }
  }, [dao?.id, router, showCompleteBountyDialog]);

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
          <span data-tip={description}>
            <TextTruncate
              line={3}
              element="span"
              truncateText="…"
              text={description}
              textTruncateChild={null}
            />
          </span>
          {externalUrl && (
            <div>
              <ExternalLink to={externalUrl} />
            </div>
          )}
        </div>
        <div className={styles.tokenWrapper}>
          <TokenWidget token={token} amount={amount} />
        </div>

        {renderStatusBasedInfo()}
      </div>
    </div>
  );
};
