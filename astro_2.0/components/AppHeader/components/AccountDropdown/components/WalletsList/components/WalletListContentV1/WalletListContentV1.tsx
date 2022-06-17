import React, { VFC } from 'react';

import { WalletType } from 'types/config';

import { useWalletContext } from 'context/WalletContext';

import { DisconnectButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/DisconnectButton';
import { WalletWithAccounts } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletWithAccounts';
import { WalletButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletButton';

import { Delimiter } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletsList/components/Delimiter';

import styles from './WalletListContentV1.module.scss';

interface OldWalletListContentProps {
  switchWalletHandler: (wallet: WalletType) => () => void;
  switchAccountHandler: (account: string) => () => void;
}

export const WalletListContentV1: VFC<OldWalletListContentProps> = props => {
  const { switchWalletHandler, switchAccountHandler } = props;

  const {
    currentWallet,
    availableAccounts,
    availableWallets,
  } = useWalletContext();

  return (
    <>
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
      <Delimiter />
      <DisconnectButton />
    </>
  );
};
