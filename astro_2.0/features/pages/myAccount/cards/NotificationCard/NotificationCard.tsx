import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { VFC, useCallback, ChangeEvent } from 'react';

import { NOTIFICATIONS_SETTINGS_PAGE_URL } from 'constants/routing';

import { UserContacts } from 'services/NotificationsService/types';

import { useNotificationsSettings } from 'astro_2.0/features/Notifications/hooks';

import { Button } from 'components/button/Button';
import { Toggle } from 'components/inputs/Toggle';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import { CardLine } from 'astro_2.0/features/pages/myAccount/cards/CardLine';
import { CardTitle } from 'astro_2.0/features/pages/myAccount/cards/CardTitle';
import { ConfigCard } from 'astro_2.0/features/pages/myAccount/cards/ConfigCard';
import { ContactInfo } from 'astro_2.0/features/pages/myAccount/cards/ContactInfo';
import { WarningMessage } from 'astro_2.0/components/WarningMessage';

import styles from './NotificationCard.module.scss';

export interface NotificationCardProps {
  smsEnabled: boolean;
  emailEnabled: boolean;
  contactsConfig: UserContacts;
}

export const NotificationCard: VFC<NotificationCardProps> = props => {
  const { smsEnabled, emailEnabled, contactsConfig } = props;

  const router = useRouter();
  const { t } = useTranslation('common');
  const { updateSettings } = useNotificationsSettings();

  const { isEmailVerified, isPhoneVerified } = contactsConfig;

  const goToSettingsPage = useCallback(() => {
    router.push({
      pathname: NOTIFICATIONS_SETTINGS_PAGE_URL,
      query: {
        notyType: 'yourDaos',
      },
    });
  }, [router]);

  const changeContactTypeState = useCallback(
    (fieldName: string, e: ChangeEvent<HTMLInputElement>) => {
      updateSettings({
        [fieldName]: e.target.checked,
      });
    },
    [updateSettings]
  );

  const onEmailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      changeContactTypeState('enableEmail', e);
    },
    [changeContactTypeState]
  );

  const onPhoneChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      changeContactTypeState('enableSms', e);
    },
    [changeContactTypeState]
  );

  return (
    <ConfigCard>
      <CardTitle>{t('myAccountPage.notification')}</CardTitle>
      <WarningMessage text="Feature is in beta" />
      <CardLine className={styles.emailLine}>
        <ContactInfo icon="carbonEmail">{t('myAccountPage.email')}</ContactInfo>
        <Tooltip
          overlay={!isEmailVerified && t('myAccountPage.notifications.email')}
        >
          <Toggle
            onChange={onEmailChange}
            defaultChecked={emailEnabled}
            disabled={!contactsConfig.isEmailVerified}
          />
        </Tooltip>
      </CardLine>
      <CardLine>
        <ContactInfo icon="carbonPhone">{t('myAccountPage.phone')}</ContactInfo>
        <Tooltip
          overlay={!isPhoneVerified && t('myAccountPage.notifications.phone')}
        >
          <Toggle
            onChange={onPhoneChange}
            defaultChecked={smsEnabled}
            disabled={!contactsConfig.isPhoneVerified}
          />
        </Tooltip>
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
