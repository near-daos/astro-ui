import React, { VFC } from 'react';

import { DisconnectButton } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/DisconnectButton';

import styles from './WalletsList.module.scss';

export const WalletsList: VFC = () => {
  return (
    <div className={styles.root}>
      <DisconnectButton />
    </div>
  );
};
