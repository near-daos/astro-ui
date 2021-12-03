import React, { FC } from 'react';
import { DAOPreview } from 'types/dao';
import { ProposalTrackerCard } from 'astro_2.0/components/DaoDetails/components/ProposalTrackerCard';
import { DaoGeneralCard } from 'astro_2.0/components/DaoDetails/components/DaoGeneralCard';
import { ActionButton } from 'features/proposal/components/action-button';

import classNames from 'classnames';
import styles from './DaoDetails.module.scss';

export interface DaoDetailsPreviewProps {
  dao: DAOPreview;
}

export const DaoDetailsPreview: FC<DaoDetailsPreviewProps> = ({ dao }) => {
  return (
    <div className={styles.root}>
      <section className={styles.general}>
        <DaoGeneralCard
          displayName={dao.displayName}
          id={dao.id}
          description={dao.description}
          links={dao.links}
          cover={dao.flagCover}
          logo={dao.flagLogo}
          legal={dao.legal}
          preview
        />
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
          <span className={styles.bold}>1</span>/0
        </div>
      </section>

      <section className={styles.controls}>
        <ActionButton
          iconName="settings"
          className={classNames(styles.controlIcon, styles.previewIcon)}
        />
        <ActionButton
          iconName="nfts"
          className={classNames(styles.controlIcon, styles.previewIcon)}
        />
        <ActionButton
          iconName="proposalBounty"
          className={classNames(styles.controlIcon, styles.previewIcon)}
        />
        <ActionButton
          iconName="proposalPoll"
          className={classNames(styles.controlIcon, styles.previewIcon)}
        />
      </section>

      <section className={styles.proposals}>
        <ProposalTrackerCard
          activeVotes={0}
          totalProposals={0}
          action={null}
          onClick={() => 0}
          preview
        />
      </section>
    </div>
  );
};
