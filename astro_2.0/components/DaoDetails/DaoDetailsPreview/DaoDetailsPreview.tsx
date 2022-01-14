import React, { FC } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';

import { DAOPreview } from 'types/dao';

import { ActionButton } from 'features/proposal/components/action-button';

import { DaoGeneralCard } from './components/DaoGeneralCard';
import { ProposalTrackerCard } from './components/ProposalTrackerCard';

import styles from './DaoDetailsPreview.module.scss';

export interface DaoDetailsPreviewProps {
  dao: DAOPreview;
}

export const DaoDetailsPreview: FC<DaoDetailsPreviewProps> = ({ dao }) => {
  const { t } = useTranslation();

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
        <div className={styles.label}>
          {t('components.daoDetailsPreview.daoFunds')}
        </div>
        <div className={styles.value}>
          <span className={styles.bold}>{dao.funds}</span> USD
        </div>
      </section>

      <section className={styles.members}>
        <div className={styles.label}>
          {t('components.daoDetailsPreview.daoMembersAndGroups')}
        </div>
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
