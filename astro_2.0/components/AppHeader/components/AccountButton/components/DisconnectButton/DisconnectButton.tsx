import React from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import { Icon } from 'components/Icon';
import { AccountPopupItem } from 'astro_2.0/components/AppHeader/components/AccountButton/components/AccountPopupItem';

import styles from './DisconnectButton.module.scss';

interface DisconnectButtonProps {
  logout: () => void;
}

export const DisconnectButton: React.FC<DisconnectButtonProps> = ({
  logout,
}) => {
  const { t } = useTranslation('common');

  return (
    <AccountPopupItem
      onClick={logout}
      className={styles.menuButton}
      content={
        <div className={styles.disconnectText}>{t('header.disconnect')}</div>
      }
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
