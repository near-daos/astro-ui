import React from 'react';
import { useTranslation } from 'next-i18next';

import { WalletType } from 'types/config';

import { Modal } from 'components/modal';
import { WalletButton } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletButton';

import styles from './WalletSelectionModal.module.scss';

interface WalletSelectionModal {
  isOpen: boolean;
  onClose: (val?: string) => void;
  signIn: (walletType: WalletType) => void;
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
        walletType={WalletType.NEAR}
        onClick={() => {
          signIn(WalletType.NEAR);
          onClose();
        }}
        name="NEAR"
        type={t('header.wallets.near.type')}
        url="wallet.near.org"
        className={styles.wallet}
      />
      <WalletButton
        disabled={!(window.near !== undefined && window.near.isSender)}
        walletType={WalletType.SENDER}
        onClick={() => {
          signIn(WalletType.SENDER);
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
