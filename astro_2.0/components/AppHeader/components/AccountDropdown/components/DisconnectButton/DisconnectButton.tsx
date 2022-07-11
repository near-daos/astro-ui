import React from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import { Icon } from 'components/Icon';
import { AccountPopupItem } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/AccountPopupItem';

import { useWalletSelectorContext } from 'context/WalletSelectorContext';

import styles from './DisconnectButton.module.scss';

export const DisconnectButton: React.FC = () => {
  const { t } = useTranslation('common');
  const { logout } = useWalletSelectorContext();

  return (
    <AccountPopupItem
      onClick={logout}
      classes={{
        root: styles.menuButton,
      }}
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
    >
      <div className={styles.disconnectText}>{t('header.disconnect')}</div>
    </AccountPopupItem>
  );
};
