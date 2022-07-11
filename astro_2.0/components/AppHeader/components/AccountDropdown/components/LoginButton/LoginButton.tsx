import React from 'react';

import { WalletType } from 'types/config';

import { useModal } from 'components/modal';

import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletIcon';
import { WalletSelectionModal } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletSelectionModal';

import { useWalletSelectorContext } from 'context/WalletSelectorContext';

export const LoginButton: React.FC = () => {
  const { login, connecting } = useWalletSelectorContext();

  const [showModal] = useModal(WalletSelectionModal, {
    signIn: walletType => login(walletType),
  });

  return (
    <WalletIcon
      walletType={WalletType.NEAR}
      isSelected={false}
      showLoader={connecting}
      onClick={showModal}
    />
  );
};
