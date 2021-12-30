import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { FlagRenderer } from 'astro_2.0/components/Flag';
import { ActionButton } from 'features/proposal/components/action-button';
import { Icon } from 'components/Icon';

import styles from './DaoDetailsSceleton.module.scss';

export const DaoDetailsSceleton: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div>
        <section className={styles.general}>
          <div className={styles.flag}>
            <FlagRenderer
              flag={undefined}
              size="sm"
              backgroundClassName={styles.flagRenderer}
            />
          </div>
          <div className={styles.title}>
            <div className={styles.name} />
            <div className={styles.address} />
          </div>
        </section>

        <section className={styles.description}>
          <Icon name="connection" className={styles.spinnerIcon} />
        </section>
      </div>
      <div>
        <section className={styles.fundsAndMembers}>
          <div className={styles.box} />
          <div className={styles.box} />
        </section>

        <section className={styles.controls}>
          <ActionButton
            iconName="settings"
            disabled
            className={styles.controlIcon}
          >
            {t('settings')}
          </ActionButton>
          <ActionButton iconName="nfts" disabled className={styles.controlIcon}>
            {t('nfts')}
          </ActionButton>
          <ActionButton
            disabled
            iconName="proposalBounty"
            className={styles.controlIcon}
          >
            {t('bounties')}
          </ActionButton>
          <ActionButton
            disabled
            iconName="proposalPoll"
            className={styles.controlIcon}
          >
            {t('polls')}
          </ActionButton>
        </section>

        <section className={styles.proposals}>
          <div className={styles.proposalBox} />
          <div className={styles.proposalBox} />
        </section>
      </div>
    </div>
  );
};
