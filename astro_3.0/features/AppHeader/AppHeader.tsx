import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { useMedia } from 'react-use';
import Link from 'next/link';

import { AppLogo } from 'astro_3.0/features/AppHeader/components/AppLogo';

import { useWalletContext } from 'context/WalletContext';
import { NotificationsBell } from 'astro_2.0/components/AppHeader/components/NotificationsBell';
import { SearchBar } from 'astro_3.0/features/SearchBar';
import { AppHealth } from 'astro_2.0/features/AppHealth';
import { AccountDropdown } from 'astro_2.0/components/AppHeader/components/AccountDropdown';

import { MobileDaosMenu } from 'astro_3.0/features/AppHeader/components/MobileDaosMenu';
import styles from './AppHeader.module.scss';

export const AppHeader: FC = () => {
  const { t } = useTranslation('common');
  const { accountId } = useWalletContext();
  const isMobile = useMedia('(max-width: 1024px)');

  return (
    <div className={styles.root}>
      <div className={styles.logoWrapper}>
        <Link href="https://astrodao.com/">
          <AppLogo />
        </Link>
      </div>

      {!isMobile && (
        <SearchBar
          withSideBar
          placeholder={t('header.search.placeholder')}
          className={styles.search}
        />
      )}

      <div className={styles.rightSection}>
        {isMobile && (
          <SearchBar
            withSideBar
            placeholder={t('header.search.placeholder')}
            className={styles.search}
          />
        )}
        <div className={styles.mobileMenu}>
          {isMobile && accountId && <MobileDaosMenu />}
        </div>
        <AppHealth />
        {!!accountId && <NotificationsBell className={styles.bell} />}
        <AccountDropdown />
      </div>
    </div>
  );
};
