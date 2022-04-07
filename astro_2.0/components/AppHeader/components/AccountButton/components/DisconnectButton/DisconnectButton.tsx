import { AccountPopupItem } from 'astro_2.0/components/AppHeader/components/AccountButton/components/AccountPopupItem';
import { Icon } from 'components/Icon';
import cn from 'classnames';
import React from 'react';
import styles from './DisconnectButton.module.scss';

interface DisconnectButtonProps {
  logout: () => void;
}

export const DisconnectButton: React.FC<DisconnectButtonProps> = ({
  logout,
}) => {
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
