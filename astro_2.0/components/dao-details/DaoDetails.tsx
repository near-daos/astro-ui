import React, { FC } from 'react';
import isEmpty from 'lodash/isEmpty';

import { DAO } from 'types/dao';

import { ProposalTrackerCard } from 'astro_2.0/components/dao-details/components/proposal-tracker-card';
import { ActionButton } from 'features/proposal/components/action-button';

import styles from './dao-details.module.scss';

export interface DaoDetailsProps {
  dao: DAO;
  accountId: string | null;
  onCreateProposalClick: () => void;
  activeProposals: number;
  totalProposals: number;
}

export const DaoDetails: FC<DaoDetailsProps> = ({
  dao,
  accountId,
  onCreateProposalClick,
  activeProposals,
  totalProposals,
}) => {
  const action = isEmpty(accountId) ? null : <>Create proposal</>;

  return (
    <div className={styles.root}>
      <section className={styles.general}>
        <div className={styles.flagWrapper}>Flag</div>
        <div className={styles.generalInfoWrapper}>
          <div>Display Name</div>
          <div>id</div>
          <div>description</div>
          <div>link</div>
        </div>
      </section>

      <section className={styles.funds}>
        <div className={styles.label}>DAO funds</div>
        <div className={styles.value}>
          <span className={styles.bold}>{dao.funds}</span> USD
        </div>
      </section>

      <section className={styles.members}>
        <div className={styles.label}>Members/Groups</div>
        <div className={styles.value}>
          <span className={styles.bold}>{dao.members}</span>/{dao.groups.length}
        </div>
      </section>

      <section className={styles.controls}>
        <ActionButton
          tooltip="DAO Settings"
          tooltipPlacement="top"
          iconName="settings"
          className={styles.controlIcon}
        />
        <ActionButton
          tooltip="NFTs"
          tooltipPlacement="top"
          iconName="nfts"
          className={styles.controlIcon}
        />
        <ActionButton
          tooltip="Bounties"
          tooltipPlacement="top"
          iconName="proposalBounty"
          className={styles.controlIcon}
        />
        <ActionButton
          tooltip="Polls"
          tooltipPlacement="top"
          iconName="proposalPoll"
          className={styles.controlIcon}
        />
      </section>

      <section className={styles.proposals}>
        <ProposalTrackerCard
          activeVotes={activeProposals}
          totalProposals={totalProposals}
          action={action}
          onClick={onCreateProposalClick}
        />
      </section>
    </div>
  );
};
