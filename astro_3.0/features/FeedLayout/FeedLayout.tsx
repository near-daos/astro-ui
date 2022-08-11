import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { FeedTabs } from 'astro_3.0/features/FeedLayout/components/FeedTabs';
import { FeedControlsLayout } from 'astro_3.0/features/FeedLayout/components/FeedControlsLayout';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

import { useWalletContext } from 'context/WalletContext';

import styles from './FeedLayout.module.scss';

export const FeedLayout: FC = () => {
  const { accountId } = useWalletContext();
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <FeedControlsLayout>
          <FeedTabs />
          {accountId && (
            <Button
              variant="green"
              className={styles.createProposalButton}
              capitalize
            >
              <Icon name="plus" className={styles.icon} />
              <span>{t('daoDetailsMinimized.createProposal')}</span>
            </Button>
          )}
        </FeedControlsLayout>
      </div>
    </div>
  );
};

export default FeedLayout;
