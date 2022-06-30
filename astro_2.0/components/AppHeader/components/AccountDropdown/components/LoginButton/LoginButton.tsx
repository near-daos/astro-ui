import React from 'react';

import { WALLETS } from 'types/config';

import { useModal } from 'components/modal';

import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletIcon';
import { WalletSelectionModal } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletSelectionModal';

import { useWalletSelectorContext } from 'context/WalletSelectorContext';

export const LoginButton: React.FC = () => {
  const { logIn, connecting } = useWalletSelectorContext();

  const [showModal] = useModal(WalletSelectionModal, {
    signIn: walletType => logIn(walletType),
  });

  return (
    <WalletIcon
      walletType={WALLETS.NEAR}
      isSelected={false}
      showLoader={connecting}
      onClick={showModal}
    />
  );
};
