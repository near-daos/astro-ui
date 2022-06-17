import React from 'react';
import cn from 'classnames';
import { useWalletContext } from 'context/WalletContext';
import { CopyButton } from 'astro_2.0/components/CopyButton';

import styles from './WalletAccountV1.module.scss';

interface WalletAccountProps {
  account: string;
  switchAccountHandler: (account: string) => () => void;
}

export const WalletAccountV1: React.FC<WalletAccountProps> = ({
  account,
  switchAccountHandler,
}) => {
  const { accountId } = useWalletContext();

  const isActive = accountId === account;

  return (
    <div
      tabIndex={0}
      role="button"
      onKeyPress={switchAccountHandler(account)}
      onClick={switchAccountHandler(account)}
      className={cn(styles.root, {
        [styles.selected]: isActive,
      })}
    >
      <div className={styles.content}>
        <div className={styles.label}>{account}</div>
        <CopyButton text={account} className={styles.copy} />
        {isActive && <div className={styles.selectedIndicator} />}
      </div>
    </div>
  );
};
