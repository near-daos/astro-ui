import cn from 'classnames';
import React, { PropsWithChildren } from 'react';

import { useWalletContext } from 'context/WalletContext';

import { Button } from 'components/button/Button';
import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletIcon';

import styles from './ConnectedAccountButton.module.scss';

export const ConnectedAccountButton: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { currentWallet, accountId, switchWallet } = useWalletContext();

  return (
    <>
      {currentWallet !== null && (
        <Button
          onClick={() => switchWallet()}
          variant="transparent"
          className={cn(styles.accountButton)}
        >
          <WalletIcon walletType={currentWallet} isSelected={false} />
          <span className={styles.accountId}>{accountId}</span>
          {children}
        </Button>
      )}
    </>
  );
};
