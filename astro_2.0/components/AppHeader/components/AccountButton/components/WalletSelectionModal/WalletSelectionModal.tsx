import { Modal } from 'components/modal';
import React from 'react';
import { WalletButton } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletButton';
import { WalletType } from 'types/config';
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
        type="web"
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
        name="Sender (beta)"
        type="extension"
        url="senderwallet.io"
        className={styles.wallet}
      />
    </Modal>
  );
};
