import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { VFC, useCallback } from 'react';

import { NOTIFICATIONS_SETTINGS_PAGE_URL } from 'constants/routing';

import { UserContacts } from 'services/NotificationsService/types';

import { Button } from 'components/button/Button';
import { Toggle } from 'components/inputs/Toggle';
import { CardLine } from 'astro_2.0/features/pages/myAccount/cards/CardLine';
import { CardTitle } from 'astro_2.0/features/pages/myAccount/cards/CardTitle';
import { ConfigCard } from 'astro_2.0/features/pages/myAccount/cards/ConfigCard';
import { ContactInfo } from 'astro_2.0/features/pages/myAccount/cards/ContactInfo';

import styles from './NotificationCard.module.scss';

interface NotificationCardProps {
  contactsConfig: UserContacts;
}

export const NotificationCard: VFC<NotificationCardProps> = props => {
  const { contactsConfig } = props;

  const router = useRouter();
  const { t } = useTranslation('common');

  const goToSettingsPage = useCallback(() => {
    router.push({
      pathname: NOTIFICATIONS_SETTINGS_PAGE_URL,
      query: {
        notyType: 'yourDaos',
      },
    });
  }, [router]);

  return (
    <ConfigCard>
      <CardTitle>
        {t('myAccountPage.notification')}
        <Toggle checked />
      </CardTitle>
      <CardLine className={styles.emailLine}>
        <ContactInfo icon="carbonEmail">{t('myAccountPage.email')}</ContactInfo>
        <Toggle disabled={!contactsConfig.isEmailVerified} />
      </CardLine>
      <CardLine>
        <ContactInfo icon="carbonPhone">{t('myAccountPage.phone')}</ContactInfo>
        <Toggle disabled={!contactsConfig.isPhoneVerified} />
      </CardLine>
      <Button
        capitalize
        onClick={goToSettingsPage}
        className={styles.settingsButton}
      >
        {t('myAccountPage.settings')}
      </Button>
    </ConfigCard>
  );
};
