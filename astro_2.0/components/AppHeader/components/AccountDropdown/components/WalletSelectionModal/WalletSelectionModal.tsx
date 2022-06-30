import React from 'react';
import { useTranslation } from 'next-i18next';

import { WALLETS, WalletType } from 'types/config';

import { Modal } from 'components/modal';
import { WalletButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletButton';

import styles from './WalletSelectionModal.module.scss';

interface WalletSelectionModal {
  isOpen: boolean;
  onClose: (val?: string) => void;
  signIn: (walletType: WALLETS) => void;
}

export const WalletSelectionModal: React.FC<WalletSelectionModal> = ({
  isOpen,
  onClose,
  signIn,
}) => {
  const { t } = useTranslation('common');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" className={styles.root}>
      <div className={styles.header}>Connect a wallet</div>
      <WalletButton
        walletType={WALLETS.NEAR}
        onClick={() => {
          signIn(WALLETS.NEAR);
          onClose();
        }}
        name="NEAR"
        type={t('header.wallets.near.type')}
        url="wallet.near.org"
        className={styles.wallet}
      />
      <WalletButton
        disabled={!(window.near !== undefined && window.near.isSender)}
        walletType={WALLETS.SENDER}
        onClick={() => {
          signIn(WALLETS.SENDER);
          onClose();
        }}
        name={`Sender (${t('header.wallets.sender.beta')})`}
        type={t('header.wallets.sender.type')}
        url="senderwallet.io"
        className={styles.wallet}
      />
    </Modal>
  );
};
