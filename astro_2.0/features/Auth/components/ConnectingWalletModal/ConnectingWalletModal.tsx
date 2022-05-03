import React, { FC } from 'react';

import { Modal } from 'components/modal';
import { WalletType } from 'types/config';

import { Icon } from 'components/Icon';
import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletIcon';
import { DotsLoader } from 'astro_2.0/components/DotsLoader';

import styles from './ConnectingWalletModal.module.scss';

export interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletType: WalletType;
}

export const ConnectingWalletModal: FC<ConfirmActionModalProps> = ({
  isOpen,
  onClose,
  walletType,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={styles.root}>
        <h2>Connecting to wallet</h2>
        <div className={styles.content}>
          <Icon name="astro" width={38} />
          <DotsLoader
            dotClassName={styles.loaderDot}
            className={styles.loader}
          />
          <WalletIcon walletType={walletType} isSelected={false} />
        </div>
      </div>
    </Modal>
  );
};
