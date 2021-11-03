import React, { FC, useCallback } from 'react';
import TextTruncate from 'react-text-truncate';
import { StatusPanel } from 'components/cards/bounty-card/components/status-panel/StatusPanel';
import { Bounty, BountyStatus } from 'components/cards/bounty-card/types';

import { useModal } from 'components/modal';
import { useBountyPageContext } from 'features/bounty/helpers';
import { UnclaimBountyDialog } from 'features/bounty/dialogs/unclaim-bounty-dialog/UnclaimBountyDialog';
import { InProgressCells } from 'components/cards/bounty-card/components/cells';
import { format, parseISO } from 'date-fns';
import ExternalLink from 'components/cards/components/external-link/ExternalLink';
import { TokenWidget } from 'components/token';
import styles from './bounty-card.module.scss';

export interface BountyCardProps {
  data: Bounty;
  status: BountyStatus;
}

export const BountyCard: FC<BountyCardProps> = ({ data, status }) => {
  const { tokenId, amount, description, claimedBy, externalUrl } = data;
  const { dao, tokens } = useBountyPageContext();

  const tokenIndex = Object.values(tokens).findIndex(
    daoToken => daoToken.tokenId === tokenId
  );

  const token =
    tokenIndex === -1 ? tokens.NEAR : Object.values(tokens)[tokenIndex];

  const [showUnclaimBountyDialog] = useModal(UnclaimBountyDialog, {
    data,
    dao,
    token,
  });

  const handleUnclaimClick = useCallback(() => showUnclaimBountyDialog(), [
    showUnclaimBountyDialog,
  ]);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleCompleteClick = useCallback(async () => {}, []);

  const renderStatusBasedInfo = () => {
    switch (status) {
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
