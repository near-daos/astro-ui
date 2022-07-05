import React from 'react';
import cn from 'classnames';

import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletIcon';

import { useWalletSelectorContext } from 'context/WalletSelectorContext';

import styles from './ConnectedAccountButton.module.scss';

export const ConnectedAccountButton: React.FC = ({ children }) => {
  const {
    accountId,
    connecting,
    selectedWalletId,
  } = useWalletSelectorContext();

  return selectedWalletId ? (
    <div
      className={cn(styles.accountButton, {
        [styles.disabled]: connecting,
      })}
    >
      <WalletIcon
        showLoader={connecting}
        walletType={selectedWalletId}
        isSelected={false}
      />
      <span className={styles.accountId}>{accountId}</span>
      {children}
    </div>
  ) : null;
};
