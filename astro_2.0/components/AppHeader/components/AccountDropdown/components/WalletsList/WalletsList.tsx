import React, { useCallback } from 'react';
import { MyAccountButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/MyAccountButton';
import { WalletType } from 'types/config';
import { DisconnectButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/DisconnectButton';
import { WalletWithAccounts } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletWithAccounts';
import { WalletButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletButton';
import styles from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletsList/WalletsList.module.scss';
import { useWalletContext } from 'context/WalletContext';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useTranslation } from 'next-i18next';

interface WalletsListProps {
  closeDropdownHandler: () => void;
}

export const WalletsList: React.FC<WalletsListProps> = ({
  closeDropdownHandler,
}) => {
  const {
    currentWallet,
    availableAccounts,
    availableWallets,
    switchAccount,
    switchWallet,
  } = useWalletContext();
  const { useWalletSelector } = useFlags();
  const { t } = useTranslation();

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
        wallet.id === WalletType.NEAR && availableAccounts.length > 1 ? (
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
      {useWalletSelector && (
        <>
          <WalletButton
            walletType={WalletType.SELECTOR_NEAR}
            onClick={switchWalletHandler(WalletType.SELECTOR_NEAR)}
            name="Selector NEAR"
            type={t('header.wallets.near.type')}
            url="mynearwallet.com"
            className={styles.wallet}
            isSelected={currentWallet === WalletType.SELECTOR_NEAR}
          />
          {availableWallets.find(item => item.id === WalletType.SENDER) && (
            <WalletButton
              walletType={WalletType.SENDER}
              onClick={switchWalletHandler(WalletType.SELECTOR_SENDER)}
              name="Selector Sender"
              type={t('header.wallets.sender.type')}
              url="senderwallet.io"
              className={styles.wallet}
              isSelected={currentWallet === WalletType.SELECTOR_SENDER}
            />
          )}
        </>
      )}
      <div className={styles.delimiter} />
      <DisconnectButton />
    </div>
  );
};
