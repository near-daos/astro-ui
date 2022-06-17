import React, { useCallback } from 'react';
import { useRouter } from 'next/router';

import { MY_ACCOUNT_PAGE_URL } from 'constants/routing';

import { Icon } from 'components/Icon';
import { AccountPopupItem } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/AccountPopupItem';

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
      classes={{
        root: className,
      }}
      onClick={goToMyAccountPage}
      icon={<Icon name="account" />}
    >
      <div className={styles.text}>My Account</div>
    </AccountPopupItem>
  );
};
