import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import React from 'react';
import { ProposalDescription } from 'astro_2.0/components/ProposalDescription';
import { TokenWidget } from 'astro_2.0/components/TokenWidget';
import cn from 'classnames';
import { BountyCardContent } from 'astro_2.0/components/BountyCard/types';
import { BountyActionsBar } from 'astro_2.0/components/BountyCard/components/BountyActionsBar';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { BountyStatus } from 'types/bounties';
import styles from './BountyCard.module.scss';

export interface BountyCardProps {
  content: BountyCardContent;
  showActionBar: boolean;
  claimHandler: () => void;
  unclaimHandler: () => void;
  completeHandler: () => void;
}

export const BountyCard: React.FC<BountyCardProps> = ({
  content,
  showActionBar,
  claimHandler,
  unclaimHandler,
  completeHandler,
}) => {
  const {
    status,
    description,
    timeToComplete,
    forgivenessPeriod,
    externalUrl,
    token,
    amount,
    bountyBond,
    type,
  } = content;

  return (
    <div className={styles.root}>
      <div className={styles.bountyGrid}>
        <InfoBlockWidget
          label="Type"
          value={type}
          valueFontSize="L"
          className={styles.proposalType}
        />
        <div className={styles.completeDate}>
          {status === BountyStatus.Available
            ? `Complete in ${timeToComplete}`
            : timeToComplete}
        </div>
        <InfoBlockWidget
          label="Status"
          value={
            <div
              className={cn({
                [styles.statusAvailable]: status === BountyStatus.Available,
                [styles.statusInProgress]: status === BountyStatus.InProgress,
                [styles.statusExpired]: status === BountyStatus.Expired,
              })}
            >
              {status}
            </div>
          }
          valueFontSize="L"
          className={styles.status}
        />
        <ProposalDescription
          description={description}
          link={externalUrl}
          className={styles.description}
        />
        <div className={styles.content}>
          {token ? (
            <InfoBlockWidget
              label="Amount"
              value={
                <TokenWidget
                  icon={token.icon}
                  symbol={token.symbol}
                  amount={amount}
                  decimals={token.decimals}
                />
              }
            />
          ) : (
            <div className={styles.loaderWrapper}>
              <LoadingIndicator />
            </div>
          )}
          {status === BountyStatus.InProgress ||
          status === BountyStatus.Expired ? (
            <InfoBlockWidget label="Claimed by" value={content.accountId} />
          ) : (
            <InfoBlockWidget label="Available claims" value={content.slots} />
          )}
        </div>
      </div>
      {showActionBar && (
        <BountyActionsBar
          bountyBond={bountyBond}
          forgivenessPeriod={forgivenessPeriod}
          bountyStatus={status}
          claimHandler={claimHandler}
          unclaimHandler={unclaimHandler}
          completeHandler={completeHandler}
        />
      )}
    </div>
  );
};
