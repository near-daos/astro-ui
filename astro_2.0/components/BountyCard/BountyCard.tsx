import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import React from 'react';
import { ProposalDescription } from 'astro_2.0/components/ProposalDescription';
import { TokenWidget } from 'astro_2.0/components/TokenWidget';
import { BountyActionsBar } from 'astro_2.0/components/BountyCard/components';
import { BountyStatus, ClaimedBy } from 'components/cards/bounty-card/types';
import { DaoFlagWidget } from 'astro_2.0/components/DaoFlagWidget';
import { Token } from 'types/token';
import cn from 'classnames';
import styles from './BountyCard.module.scss';

export interface BountyCardProps {
  id: string;
  daoId: string;
  token: Token;
  coverUrl: string;
  daoFlag: string;
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
  proposalBond: string;
}

export const BountyCard: React.FC<BountyCardProps> = ({
  id,
  daoId,
  daoFlag,
  amount,
  description,
  forgivenessPeriod,
  externalUrl,
  slots,
  claimedBy = [],
  deadlineThreshold,
  currentUser,
  bountyBond,
  proposalBond,
}) => {
  const claimedByUser = claimedBy.find(
    claim => claim.accountId === currentUser
  );

  const status = (claimedByUser ? 'In Progress' : 'Available') as BountyStatus;

  return (
    <div className={styles.root}>
      <DaoFlagWidget
        daoName="Dkarpov dao"
        flagUrl={daoFlag}
        className={styles.flag}
      />
      <div className={styles.bountyGrid}>
        <InfoBlockWidget
          label="Type"
          value="Bounty"
          valueFontSize="L"
          className={styles.proposalType}
        />
        <div className={styles.daysLeft}>
          {deadlineThreshold} Days to complete
        </div>
        <InfoBlockWidget
          label="Status"
          value={
            <div
              className={cn({
                [styles.statusAvailable]: status === 'Available',
                [styles.statusInProgress]: status === 'In progress',
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
            value={<TokenWidget icon="" symbol="NEAR" amount={amount} />}
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
        currentUser={currentUser}
        deadlineThreshold={deadlineThreshold}
        proposalBond={proposalBond}
      />
    </div>
  );
};
