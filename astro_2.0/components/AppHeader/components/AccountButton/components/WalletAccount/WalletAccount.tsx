import React from 'react';
import { Button } from 'components/button/Button';
import styles from './WalletAccount.module.scss';

interface WalletAccountProps {
  account: string;
  switchAccountHandler: (account: string) => () => void;
}

export const WalletAccount: React.FC<WalletAccountProps> = ({
  account,
  switchAccountHandler,
}) => {
  return (
    <div className={styles.root}>
      <Button variant="transparent" onClick={switchAccountHandler(account)}>
        {account}
      </Button>
    </div>
  );
};
