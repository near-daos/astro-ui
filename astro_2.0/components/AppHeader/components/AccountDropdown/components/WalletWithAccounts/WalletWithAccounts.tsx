import { WalletButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletButton';
import { WalletType } from 'types/config';
import { useWalletContext } from 'context/WalletContext';
import { WalletAccount } from 'context/WalletContext/types';

import { Accordion } from 'astro_2.0/components/Accordion';
import React from 'react';
import { WalletMeta } from 'services/sputnik/SputnikNearService/walletServices/types';
import { WalletAccountV1 } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletWithAccounts/components/WalletAccountV1';
import styles from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletWithAccounts/WalletWithAccounts.module.scss';
import cn from 'classnames';

interface WalletAccountsProps {
  wallet: WalletMeta;
  isSelected: boolean;
  accounts: WalletAccount[];
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
  const { accountId } = useWalletContext();

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
          className={cn(styles.toggle, styles.notInteractive)}
        />
      }
      className={styles.root}
      headerClassName={styles.header}
      contentContainerClassName={styles.content}
    >
      {accounts
        .sort((a, b) => {
          if (a.acc === accountId) {
            return -1;
          }

          if (b.acc === accountId) {
            return 1;
          }

          return 0;
        })
        .map(({ acc }) => {
          return (
            <WalletAccountV1
              key={acc}
              account={acc}
              switchAccountHandler={switchAccountHandler}
            />
          );
        })}
    </Accordion>
  );
};
