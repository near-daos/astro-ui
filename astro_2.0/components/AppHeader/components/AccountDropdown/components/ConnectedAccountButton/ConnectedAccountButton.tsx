import cn from 'classnames';
import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletIcon';
import React from 'react';
import { useWalletContext } from 'context/WalletContext';
import styles from './ConnectedAccountButton.module.scss';

export const ConnectedAccountButton: React.FC = ({ children }) => {
  const { currentWallet, connectingToWallet, accountId } = useWalletContext();

  return (
    <>
      {currentWallet !== null && (
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
      )}
    </>
  );
};
