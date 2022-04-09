import React, { useCallback } from 'react';
import { useRouter } from 'next/router';

import { MY_ACCOUNT_PAGE_URL } from 'constants/routing';

import { Icon } from 'components/Icon';
import { AccountPopupItem } from 'astro_2.0/components/AppHeader/components/AccountButton/components/AccountPopupItem';

import styles from './MyAccountButton.module.scss';

interface MyAccountButtonProps {
  className?: string;
  closeDropdown: () => void;
}

export const MyAccountButton: React.FC<MyAccountButtonProps> = ({
  className,
  closeDropdown,
}) => {
  const router = useRouter();

  const goToMyAccountPage = useCallback(() => {
    closeDropdown();
    router.push(MY_ACCOUNT_PAGE_URL);
  }, [router, closeDropdown]);

  return (
    <AccountPopupItem
      className={className}
      onClick={goToMyAccountPage}
      icon={<Icon name="account" />}
      content={<div className={styles.text}>My Account</div>}
    />
  );
};
