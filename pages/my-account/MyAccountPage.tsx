import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';

import { WalletIdCard } from 'astro_2.0/features/pages/myAccount/cards/WalletIdCard';
import { NotificationCard } from 'astro_2.0/features/pages/myAccount/cards/NotificationCard';

import styles from './MyAccountPage.module.scss';

const MyAccountPage: VFC = () => {
  const { t } = useTranslation('common');

  return (
    <div>
      <h1 className={styles.header}>{t('myAccountPage.header')}</h1>
      <div className={styles.cards}>
        <WalletIdCard />
        <NotificationCard />
      </div>
    </div>
  );
};

export default MyAccountPage;
