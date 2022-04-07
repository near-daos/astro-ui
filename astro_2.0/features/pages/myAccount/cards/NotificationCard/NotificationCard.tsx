import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';

import { Button } from 'components/button/Button';
import { Toggle } from 'components/inputs/Toggle';
import { CardLine } from 'astro_2.0/features/pages/myAccount/cards/CardLine';
import { CardTitle } from 'astro_2.0/features/pages/myAccount/cards/CardTitle';
import { ConfigCard } from 'astro_2.0/features/pages/myAccount/cards/ConfigCard';
import { ContactInfo } from 'astro_2.0/features/pages/myAccount/cards/ContactInfo';

import styles from './NotificationCard.module.scss';

export const NotificationCard: VFC = () => {
  const { t } = useTranslation('common');

  return (
    <ConfigCard>
      <CardTitle>
        {t('myAccountPage.notification')}
        <Toggle checked />
      </CardTitle>
      <CardLine className={styles.emailLine}>
        <ContactInfo icon="carbonEmail">{t('myAccountPage.email')}</ContactInfo>
        <Toggle />
      </CardLine>
      <CardLine>
        <ContactInfo icon="carbonPhone">{t('myAccountPage.phone')}</ContactInfo>
        <Toggle />
      </CardLine>
      <Button capitalize className={styles.settingsButton}>
        {t('myAccountPage.settings')}
      </Button>
    </ConfigCard>
  );
};
