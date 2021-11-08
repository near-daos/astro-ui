import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import React from 'react';
import { ProposalDescription } from 'astro_2.0/components/ProposalDescription';
import { TokenWidget } from 'astro_2.0/components/TokenWidget';
import { BountyActionsBar } from 'astro_2.0/components/BountyCard/components';
import { ClaimedBy } from 'components/cards/bounty-card/types';
import { Token } from 'types/token';
import cn from 'classnames';
import { BountyStatus } from 'astro_2.0/components/BountyCard/types';
import { ProposalVariant } from 'types/proposal';
import {
  getDistanceFromNow,
  getTimeTillComplete,
} from 'astro_2.0/components/BountyCard/helpers';
import styles from './BountyCard.module.scss';

export interface BountyCardProps {
  id: string;
  daoId: string;
  token: Token;
  amount: string;
  description: string;
  forgivenessPeriod: string;
  externalUrl?: string;
  slots: number;
  claimedBy: ClaimedBy[];
  deadlineThreshold: string;
  completionDate?: string;
  currentUser: string;
  bountyBond: string;
  setBountyData: (bountyId: string, variant: ProposalVariant) => void;
}

export const BountyCard: React.FC<BountyCardProps> = ({
  id,
  daoId,
  amount,
  description,
  token,
  forgivenessPeriod,
  externalUrl,
  slots,
  claimedBy = [],
  deadlineThreshold,
  currentUser,
  bountyBond,
  setBountyData,
}) => {
  const claimedByUser = claimedBy.find(
    claim => claim.accountId === currentUser
  );
  const status = claimedByUser
    ? BountyStatus.InProgress
    : BountyStatus.Available;

  const timeToComplete = claimedByUser
    ? getTimeTillComplete(claimedByUser.startTime, claimedByUser.deadline)
    : getDistanceFromNow(deadlineThreshold);

  return (
    <div className={styles.root}>
      <div className={styles.bountyGrid}>
        <InfoBlockWidget
          label="Type"
          value="Bounty"
          valueFontSize="L"
          className={styles.proposalType}
        />
        <div className={styles.completeDate}>Complete: {timeToComplete}</div>
        <InfoBlockWidget
          label="Status"
          value={
            <div
              className={cn({
                [styles.statusAvailable]: status === BountyStatus.Available,
                [styles.statusInProgress]: status === BountyStatus.InProgress,
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
          <InfoBlockWidget
            label="Amount"
            value={
              <TokenWidget
                icon={token.icon}
                symbol={token.symbol}
                amount={amount}
                decimals={24}
              />
            }
          />
          <InfoBlockWidget label="Available claims" value={slots} />
        </div>
      </div>
      <BountyActionsBar
        daoId={daoId}
        bountyId={id}
        bountyBond={bountyBond}
        forgivenessPeriod={forgivenessPeriod}
        bountyStatus={status}
        startTime={claimedByUser?.startTime}
        currentUser={currentUser}
        deadlineThreshold={deadlineThreshold}
        setBountyData={setBountyData}
      />
    </div>
  );
};
