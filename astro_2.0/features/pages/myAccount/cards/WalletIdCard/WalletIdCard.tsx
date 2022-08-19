import { useTranslation } from 'next-i18next';
import React, { VFC, useCallback } from 'react';

import { UserContacts } from 'services/NotificationsService/types';

import { useWalletContext } from 'context/WalletContext';

import { useModal } from 'components/modal';

import { AccountBadge } from 'astro_2.0/features/pages/myAccount/AccountBadge';
import { CardTitle } from 'astro_2.0/features/pages/myAccount/cards/CardTitle';
import { ConfigCard } from 'astro_2.0/features/pages/myAccount/cards/ConfigCard';
import { AddUserInfoModal } from 'astro_2.0/features/pages/myAccount/cards/WalletIdCard/components/AddUserInfoModal';

import { UsaOnly } from './components/UsaOnly';
import { ContactLine } from './components/ContactLine';

interface WalletIdCardProps {
  contactsConfig: UserContacts;
  setConfig: (config: UserContacts) => void;
}

export const WalletIdCard: VFC<WalletIdCardProps> = props => {
  const { setConfig, contactsConfig } = props;

  const { email, isEmailVerified, phoneNumber, isPhoneVerified } =
    contactsConfig;

  const { accountId, pkAndSignature } = useWalletContext();

  const { t } = useTranslation('common');

  const [showModal] = useModal(AddUserInfoModal);

  const openModal = useCallback(
    (isEmail: boolean, isEdit: boolean) => {
      showModal({
        isEdit,
        isEmail,
        setConfig,
        accountId,
        pkAndSignature,
      });
    },
    [setConfig, showModal, accountId, pkAndSignature]
  );

  const openAddEmailModal = useCallback(() => {
    openModal(true, isEmailVerified);
  }, [openModal, isEmailVerified]);

  const openAddPhoneModal = useCallback(() => {
    openModal(false, isPhoneVerified);
  }, [openModal, isPhoneVerified]);

  return (
    <ConfigCard>
      <CardTitle>
        {t('myAccountPage.walletId')}
        <AccountBadge />
      </CardTitle>
      <ContactLine
        icon="carbonEmail"
        contact={email}
        label="myAccountPage.email"
        isVerified={isEmailVerified}
        onButtonClick={openAddEmailModal}
      />

      <ContactLine
        icon="carbonPhone"
        contact={phoneNumber}
        label="myAccountPage.phone"
        isVerified={isPhoneVerified}
        extraLabel={<UsaOnly />}
        onButtonClick={openAddPhoneModal}
      />
    </ConfigCard>
  );
};
