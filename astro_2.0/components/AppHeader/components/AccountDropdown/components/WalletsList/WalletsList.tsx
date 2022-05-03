import React, { useCallback, useEffect, useState } from 'react';
import { MyAccountButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/MyAccount';
import { WalletType } from 'types/config';
import { DisconnectButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/DisconnectButton';
import { WalletWithAccounts } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletWithAccounts';
import { WalletButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletButton';
import styles from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletsList/WalletsList.module.scss';
import { useWalletContext } from 'context/WalletContext';

interface WalletsListProps {
  closeDropdownHandler: () => void;
}

export const WalletsList: React.FC<WalletsListProps> = ({
  closeDropdownHandler,
}) => {
  const {
    currentWallet,
    getAvailableAccounts,

    availableWallets,
    switchAccount,
    switchWallet,
  } = useWalletContext();

  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);

  useEffect(() => {
    if (!getAvailableAccounts) {
      return;
    }

    getAvailableAccounts().then(setAvailableAccounts);
  }, [getAvailableAccounts]);

  const switchAccountHandler = useCallback(
    (account: string) => () => {
      switchAccount(WalletType.NEAR, account);
    },
    [switchAccount]
  );

  const switchWalletHandler = useCallback(
    (wallet: WalletType) => async () => {
      closeDropdownHandler();
      await switchWallet(wallet);
    },
    [closeDropdownHandler, switchWallet]
  );

  return (
    <div className={styles.root}>
      <MyAccountButton
        className={styles.menuButton}
        closeDropdown={closeDropdownHandler}
      />
      <div className={styles.delimiter} />
      <div className={styles.chooseWalletCaption}>Choose wallet</div>
      {availableWallets.map(wallet =>
        wallet.id === WalletType.NEAR && availableAccounts.length > 0 ? (
          <WalletWithAccounts
            key={wallet.id}
            wallet={wallet}
            isSelected={currentWallet === wallet.id}
            accounts={availableAccounts}
            switchAccountHandler={switchAccountHandler}
            switchWalletHandler={switchWalletHandler}
          />
        ) : (
          <WalletButton
            key={wallet.id}
            walletType={wallet.id}
            isSelected={currentWallet === wallet.id}
            onClick={switchWalletHandler(wallet.id)}
            name={wallet.name}
            type={wallet.type}
            url={wallet.url}
          />
        )
      )}
      <div className={styles.delimiter} />
      <DisconnectButton />
    </div>
  );
};
