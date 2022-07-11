import React, { VFC } from 'react';

import { MyAccountButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/MyAccountButton';
import { DisconnectButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/DisconnectButton';

import styles from './WalletsList.module.scss';

interface WalletsListProps {
  closeDropdownHandler: () => void;
}

export const WalletsList: VFC<WalletsListProps> = props => {
  const { closeDropdownHandler } = props;

  return (
    <div className={styles.root}>
      <MyAccountButton
        className={styles.menuButton}
        closeDropdown={closeDropdownHandler}
      />
      <div className={styles.delimiter} />
      <DisconnectButton />
    </div>
  );
};
