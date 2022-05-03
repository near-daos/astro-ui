import { AccountPopupItem } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/AccountPopupItem';
import { Icon } from 'components/Icon';
import cn from 'classnames';
import React from 'react';
import styles from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/DisconnectButton/DisconnectButton.module.scss';
import { useWalletContext } from 'context/WalletContext';

export const DisconnectButton: React.FC = () => {
  const { logout } = useWalletContext();

  return (
    <AccountPopupItem
      onClick={() => logout()}
      className={styles.menuButton}
      content={<div className={styles.disconnectText}>Disconnect</div>}
      icon={
        <Icon
          name="logout"
          className={cn(
            styles.disconnect,
            styles.disconnectIconColor,
            styles.icon
          )}
        />
      }
    />
  );
};
