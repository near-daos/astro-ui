import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletIcon';
import { WalletType } from 'types/config';
import React from 'react';
import { useModal } from 'components/modal';
import { WalletSelectionModal } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletSelectionModal';
import { useWalletContext } from 'context/WalletContext';

export const LoginButton: React.FC = () => {
  const { login, connectingToWallet } = useWalletContext();
  const [showModal] = useModal(WalletSelectionModal, {
    signIn: walletType => login(walletType),
  });

  return (
    <WalletIcon
      walletType={WalletType.NEAR}
      isSelected={false}
      showLoader={connectingToWallet}
      onClick={showModal}
    />
  );
};
