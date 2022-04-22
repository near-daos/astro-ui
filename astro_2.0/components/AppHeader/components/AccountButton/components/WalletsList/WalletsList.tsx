import React from 'react';
import { useTranslation } from 'next-i18next';

import { WalletType } from 'types/config';
import { WalletMeta } from 'services/sputnik/SputnikNearService/services/types';

import { WalletButton } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletButton';
import { MyAccountButton } from 'astro_2.0/components/AppHeader/components/AccountButton/components/MyAccountButton';
import { DisconnectButton } from 'astro_2.0/components/AppHeader/components/AccountButton/components/DisconnectButton';
import { WalletWithAccounts } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletWithAccounts';

import styles from './WalletsList.module.scss';

export interface WalletsListProps {
  logoutHandler: () => Promise<void>;
  availableNearAccounts: string[];
  availableWallets: WalletMeta[];
  selectedWallet: WalletType;
  switchAccountHandler: (account: string) => () => void;
  switchWalletHandler: (walletType: WalletType) => () => void;
  closeDropdownHandler: () => void;
}

export const WalletsList: React.FC<WalletsListProps> = ({
  logoutHandler,
  availableNearAccounts,
  availableWallets,
  selectedWallet,
  switchWalletHandler,
  switchAccountHandler,
  closeDropdownHandler,
}) => {
  // todo - temp disable multiple accounts
  const showMultipleAccounts = false;

  const { t } = useTranslation('common');

  return (
    <div className={styles.root}>
      <MyAccountButton
        className={styles.menuButton}
        closeDropdown={closeDropdownHandler}
      />
      <div className={styles.delimiter} />
      <div className={styles.chooseWalletCaption}>
        {t('header.chooseWallet')}
      </div>
      {availableWallets.map(wallet =>
        wallet.id === WalletType.NEAR && showMultipleAccounts ? (
          <WalletWithAccounts
            key={wallet.id}
            wallet={wallet}
            isSelected={selectedWallet === wallet.id}
            accounts={availableNearAccounts}
            switchAccountHandler={switchAccountHandler}
            switchWalletHandler={switchWalletHandler}
          />
        ) : (
          <WalletButton
            key={wallet.id}
            walletType={wallet.id}
            isSelected={selectedWallet === wallet.id}
            onClick={switchWalletHandler(wallet.id)}
            name={wallet.name}
            type={wallet.type}
            url={wallet.url}
          />
        )
      )}
      <div className={styles.delimiter} />
      <DisconnectButton logout={logoutHandler} />
    </div>
  );
};
