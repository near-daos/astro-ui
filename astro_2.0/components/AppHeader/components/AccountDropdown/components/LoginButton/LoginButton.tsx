import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletIcon';
import { WalletType } from 'types/config';
import React from 'react';
import { useModal } from 'components/modal';
import { WalletSelectionModal } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletSelectionModal';
import { useWalletContext } from 'context/WalletContext';
import { useAppVersion } from 'hooks/useAppVersion';
import { Button } from 'components/button/Button';

import styles from './LoginButton.module.scss';

export const LoginButton: React.FC = () => {
  const { login, connectingToWallet } = useWalletContext();
  const { appVersion } = useAppVersion();
  const [showModal] = useModal(WalletSelectionModal, {
    signIn: walletType => login(walletType),
  });

  if (appVersion === 3) {
    return (
      <Button
        variant="green"
        size="small"
        capitalize
        disabled={connectingToWallet}
        onClick={() => showModal()}
        className={styles.loginButton}
      >
        Connect wallet
      </Button>
    );
  }

  return (
    <WalletIcon
      walletType={WalletType.NEAR}
      isSelected={false}
      showLoader={connectingToWallet}
      onClick={showModal}
    />
  );
};
