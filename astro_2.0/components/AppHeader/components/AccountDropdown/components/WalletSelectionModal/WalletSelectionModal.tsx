import React from 'react';
import { useTranslation } from 'next-i18next';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { WalletButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletButton';
import { WalletType } from 'types/config';

import { Modal } from 'components/modal';

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
  const { useWalletSelector } = useFlags();
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
        name="Sender"
        type={t('header.wallets.sender.type')}
        url="senderwallet.io"
        className={styles.wallet}
      />
      {useWalletSelector && (
        <>
          <WalletButton
            walletType={WalletType.SELECTOR_NEAR}
            onClick={() => {
              signIn(WalletType.SELECTOR_NEAR);
              onClose();
            }}
            name="Selector NEAR"
            type={t('header.wallets.near.type')}
            url="mynearwallet.com"
            className={styles.wallet}
          />
          <WalletButton
            disabled={!(window.near !== undefined && window.near.isSender)}
            walletType={WalletType.SENDER}
            onClick={() => {
              signIn(WalletType.SELECTOR_SENDER);
              onClose();
            }}
            name="Selector Sender"
            type={t('header.wallets.sender.type')}
            url="senderwallet.io"
            className={styles.wallet}
          />
        </>
      )}
    </Modal>
  );
};
