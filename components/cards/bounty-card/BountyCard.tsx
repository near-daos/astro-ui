import React, { FC } from 'react';
import TextTruncate from 'react-text-truncate';
import { StatusPanel } from 'components/cards/bounty-card/components/status-panel/StatusPanel';

import { useBountyPageContext } from 'features/bounty/helpers';
import ExternalLink from 'components/cards/components/external-link/ExternalLink';
import { TokenWidget } from 'components/token';
import { Bounty, BountyStatus } from 'types/bounties';
import styles from './bounty-card.module.scss';

export interface BountyCardProps {
  data: Bounty;
  status: BountyStatus;
}

export const BountyCard: FC<BountyCardProps> = ({ data, status }) => {
  const { tokenId, amount, description, externalUrl } = data;
  const { tokens } = useBountyPageContext();

  const tokenIndex = Object.values(tokens).findIndex(
    daoToken => daoToken.tokenId === tokenId
  );

  const token =
    tokenIndex === -1 ? tokens.NEAR : Object.values(tokens)[tokenIndex];

  const renderStatusBasedInfo = () => {
    switch (status) {
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
