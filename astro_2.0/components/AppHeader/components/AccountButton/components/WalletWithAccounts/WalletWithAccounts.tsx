import { WalletButton } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletButton';
import { WalletType } from 'types/config';

import { Accordion } from 'astro_2.0/components/Accordion';
import React from 'react';
import { WalletMeta } from 'services/sputnik/SputnikNearService/services/types';
import { WalletAccount } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletAccount';
import styles from './WalletWithAccounts.module.scss';

interface WalletAccountsProps {
  wallet: WalletMeta;
  isSelected: boolean;
  accounts: string[];
  switchAccountHandler: (account: string) => () => void;
  switchWalletHandler: (walletType: WalletType) => () => void;
}

export const WalletWithAccounts: React.FC<WalletAccountsProps> = ({
  wallet,
  isSelected,
  switchAccountHandler,
  switchWalletHandler,
  accounts,
}) => {
  return (
    <Accordion
      title={
        <WalletButton
          walletType={wallet.id}
          isSelected={isSelected}
          onClick={switchWalletHandler(wallet.id)}
          name={wallet.name}
          type={wallet.type}
          url={wallet.url}
        />
      }
      className={styles.root}
    >
      {accounts.map(account => (
        <WalletAccount
          account={account}
          switchAccountHandler={switchAccountHandler}
        />
      ))}
    </Accordion>
  );
};
