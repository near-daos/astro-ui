import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { MainLayout } from 'astro_3.0/features/MainLayout';
import { FeedTabs } from 'astro_3.0/features/FeedLayout/components/FeedTabs';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

import styles from './FeedLayout.module.scss';

export const FeedLayout: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <MainLayout className={styles.main}>
        <div className={styles.content}>
          <FeedTabs />
          <Button
            variant="green"
            className={styles.createProposalButton}
            capitalize
          >
            <Icon name="plus" className={styles.icon} />
            <span>{t('daoDetailsMinimized.createProposal')}</span>
          </Button>
        </div>
      </MainLayout>
    </div>
  );
};

export default FeedLayout;
