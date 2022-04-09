import React from 'react';
import { MyAccountButton } from 'astro_2.0/components/AppHeader/components/AccountButton/components/MyAccount';
import { WalletType } from 'types/config';
import { DisconnectButton } from 'astro_2.0/components/AppHeader/components/AccountButton/components/DisconnectButton';
import { WalletMeta } from 'services/sputnik/SputnikNearService/services/types';
import { WalletWithAccounts } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletWithAccounts';
import { WalletButton } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletButton';
import styles from './WalletsList.module.scss';

interface WalletsListProps {
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
  return (
    <div className={styles.root}>
      <MyAccountButton
        className={styles.menuButton}
        closeDropdown={closeDropdownHandler}
      />
      <div className={styles.delimiter} />
      <div className={styles.chooseWalletCaption}>Choose wallet</div>
      {availableWallets.map(wallet =>
        wallet.id === WalletType.NEAR ? (
          <WalletWithAccounts
            wallet={wallet}
            isSelected={selectedWallet === wallet.id}
            accounts={availableNearAccounts}
            switchAccountHandler={switchAccountHandler}
            switchWalletHandler={switchWalletHandler}
          />
        ) : (
          <WalletButton
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
