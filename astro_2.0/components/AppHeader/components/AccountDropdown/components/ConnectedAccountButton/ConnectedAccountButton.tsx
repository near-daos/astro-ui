import React from 'react';
import cn from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { useWalletContext } from 'context/WalletContext';

import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletIcon';

import styles from './ConnectedAccountButton.module.scss';

export const ConnectedAccountButton: React.FC = ({ children }) => {
  const { newWalletDropdown } = useFlags();
  const { currentWallet, connectingToWallet, accountId } = useWalletContext();

  if (currentWallet === null && !newWalletDropdown) {
    return null;
  }

  return (
    <div
      className={cn(styles.accountButton, {
        [styles.disabled]: connectingToWallet,
      })}
    >
      <WalletIcon
        showLoader={connectingToWallet}
        walletType={currentWallet}
        isSelected={false}
      />
      <span className={styles.accountId}>{accountId}</span>
      {children}
    </div>
  );
};
