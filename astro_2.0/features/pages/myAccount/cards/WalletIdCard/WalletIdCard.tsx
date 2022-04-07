import { useTranslation } from 'next-i18next';
import React, { useCallback, VFC } from 'react';

import { useModal } from 'components/modal/hooks';

import { Button } from 'components/button/Button';
import { CardLine } from 'astro_2.0/features/pages/myAccount/cards/CardLine';
import { AccountBadge } from 'astro_2.0/features/pages/myAccount/AccountBadge';
import { CardTitle } from 'astro_2.0/features/pages/myAccount/cards/CardTitle';
import { ConfigCard } from 'astro_2.0/features/pages/myAccount/cards/ConfigCard';
import { ContactInfo } from 'astro_2.0/features/pages/myAccount/cards/ContactInfo';
import { AddUserInfoModal } from 'astro_2.0/features/pages/myAccount/AddUserInfoModal';

import styles from './WalletIdCard.module.scss';

export const WalletIdCard: VFC = () => {
  const { t } = useTranslation('common');

  const [showModal] = useModal(AddUserInfoModal);

  const openAddEmailModal = useCallback(() => {
    showModal({
      isEmail: true,
    });
  }, [showModal]);

  const openAddPhoneModal = useCallback(() => {
    showModal({
      isEmail: false,
    });
  }, [showModal]);

  return (
    <ConfigCard>
      <CardTitle>
        {t('myAccountPage.walletId')}
        <AccountBadge />
      </CardTitle>
      <CardLine className={styles.emailLine}>
        <ContactInfo icon="carbonEmail">{t('myAccountPage.email')}</ContactInfo>
        <Button
          capitalize
          onClick={openAddEmailModal}
          className={styles.addButton}
        >
          {t('myAccountPage.add')}
        </Button>
      </CardLine>
      <CardLine>
        <ContactInfo icon="carbonPhone">{t('myAccountPage.phone')}</ContactInfo>
        <Button
          capitalize
          onClick={openAddPhoneModal}
          className={styles.addButton}
        >
          {t('myAccountPage.add')}
        </Button>
      </CardLine>
    </ConfigCard>
  );
};
