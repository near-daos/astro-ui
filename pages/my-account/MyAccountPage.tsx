import React, { VFC, useState } from 'react';
import Head from 'next/head';

import { useTranslation } from 'next-i18next';

import {
  UserContacts,
  NotificationSettingDTO,
} from 'services/NotificationsService/types';

import { WalletIdCard } from 'astro_2.0/features/pages/myAccount/cards/WalletIdCard';
import { NotificationCard } from 'astro_2.0/features/pages/myAccount/cards/NotificationCard';
import { AllowanceKeysCard } from 'astro_2.0/features/pages/myAccount/cards/AllowanceKeysCard';
import { AppVersion } from 'astro_3.0/features/AppVersion';

import styles from './MyAccountPage.module.scss';

export interface MyAccountPageProps {
  contactsConfig: UserContacts;
  notyConfig: NotificationSettingDTO;
}

const MyAccountPage: VFC<MyAccountPageProps> = ({
  notyConfig,
  contactsConfig,
}) => {
  const { t } = useTranslation('common');

  const [config, setConfig] = useState(contactsConfig);

  const { enableEmail, enableSms } = notyConfig;

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
          <AppVersion />
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
