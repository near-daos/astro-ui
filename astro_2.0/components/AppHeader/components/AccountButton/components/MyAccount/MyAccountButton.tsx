import { AccountPopupItem } from 'astro_2.0/components/AppHeader/components/AccountButton/components/AccountPopupItem';
import styles from 'astro_2.0/components/AppHeader/components/AccountButton/AccountButton.module.scss';
import { Icon } from 'components/Icon';
import React from 'react';

export const MyAccountButton: React.FC = () => {
  return (
    <AccountPopupItem
      content={<div className={styles.text}>My Account</div>}
      icon={<Icon name="account" className={styles.icon} />}
    />
  );
};
