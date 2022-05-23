import React, { VFC, useState, useEffect } from 'react';
import Head from 'next/head';

import { useTranslation } from 'next-i18next';

import {
  UserContacts,
  NotificationSettingDTO,
} from 'services/NotificationsService/types';

import { WalletIdCard } from 'astro_2.0/features/pages/myAccount/cards/WalletIdCard';
import { NotificationCard } from 'astro_2.0/features/pages/myAccount/cards/NotificationCard';
import { AllowanceKeysCard } from 'astro_2.0/features/pages/myAccount/cards/AllowanceKeysCard';

import { useWalletContext } from 'context/WalletContext';
import { ALL_FEED_URL } from 'constants/routing';
import { useRouter } from 'next/router';

import styles from './MyAccountPage.module.scss';

export interface MyAccountPageProps {
  contactsConfig: UserContacts;
  notyConfig: NotificationSettingDTO;
}

const MyAccountPage: VFC<MyAccountPageProps> = ({
  notyConfig,
  contactsConfig,
}) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { accountId } = useWalletContext();

  const [config, setConfig] = useState(contactsConfig);

  const { enableEmail, enableSms } = notyConfig;

  useEffect(() => {
    if (!accountId) {
      router.push(ALL_FEED_URL);
    }
  }, [accountId, router]);

  return (
    <div>
      <Head>
        <title>My account</title>
      </Head>
      <h1 className={styles.header}>{t('myAccountPage.header')}</h1>
      <div className={styles.cards}>
        <div className={styles.column}>
          <WalletIdCard contactsConfig={config} setConfig={setConfig} />
          <AllowanceKeysCard />
        </div>
        <div className={styles.column}>
          <NotificationCard
            contactsConfig={config}
            smsEnabled={enableSms}
            emailEnabled={enableEmail}
          />
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
