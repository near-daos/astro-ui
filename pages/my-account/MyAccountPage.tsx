import React, { VFC, useState } from 'react';

import { useTranslation } from 'next-i18next';

import {
  UserContacts,
  NotificationSettingDTO,
} from 'services/NotificationsService/types';

import { WalletIdCard } from 'astro_2.0/features/pages/myAccount/cards/WalletIdCard';
import { NotificationCard } from 'astro_2.0/features/pages/myAccount/cards/NotificationCard';

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
      <h1 className={styles.header}>{t('myAccountPage.header')}</h1>
      <div className={styles.cards}>
        <WalletIdCard contactsConfig={config} setConfig={setConfig} />
        <NotificationCard
          contactsConfig={config}
          smsEnabled={enableSms}
          emailEnabled={enableEmail}
        />
      </div>
    </div>
  );
};

export default MyAccountPage;
