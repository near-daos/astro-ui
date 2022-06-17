import cn from 'classnames';
import React, { useCallback } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { WalletType } from 'types/config';

import { useWalletContext } from 'context/WalletContext';

import { MyAccountButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/MyAccountButton';

import { Delimiter } from './components/Delimiter';
import { WalletListContentV1 } from './components/WalletListContentV1';
import { WalletListContentV2 } from './components/WalletListContentV2';

import styles from './WalletsList.module.scss';

interface WalletsListProps {
  closeDropdownHandler: () => void;
}

export const WalletsList: React.FC<WalletsListProps> = ({
  closeDropdownHandler,
}) => {
  const { newWalletDropdown } = useFlags();

  const context = useWalletContext();

  const { switchAccount, switchWallet } = context;

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

  const rootClassName = cn(styles.root, {
    [styles.v2]: newWalletDropdown,
  });

  return (
    <div className={rootClassName}>
      <MyAccountButton
        className={styles.menuButton}
        closeDropdown={closeDropdownHandler}
      />
      <Delimiter />
      {newWalletDropdown ? (
        <WalletListContentV2
          switchWalletHandler={switchWalletHandler}
          switchAccountHandler={switchAccountHandler}
        />
      ) : (
        <WalletListContentV1
          switchWalletHandler={switchWalletHandler}
          switchAccountHandler={switchAccountHandler}
        />
      )}
    </div>
  );
};
