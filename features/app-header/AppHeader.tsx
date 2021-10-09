import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { ALL_DAOS_URL } from 'constants/routing';

import { Icon } from 'components/Icon';
import SearchBar from 'components/search-bar';
import { Button } from 'components/button/Button';
import { SidebarNavigation } from 'features/sidebar-navigation';
import { AccountButton } from 'features/app-header/components/account-button';

import styles from './app-header.module.scss';

export interface AppHeaderProps {
  isLandingPage: boolean;
}

export const AppHeader: FC<AppHeaderProps> = ({ isLandingPage }) => {
  const router = useRouter();
  const [showSideBar, setShowSideBar] = useState(false);

  useEffect(() => {
    const bodyEl = document.querySelector('body');

    if (bodyEl && showSideBar) {
      bodyEl.style.overflow = 'hidden';
    } else if (bodyEl && !showSideBar) {
      bodyEl.style.removeProperty('overflow');
    }
  }, [showSideBar]);

  const openNavigation = useCallback(() => {
    setShowSideBar(true);
  }, [setShowSideBar]);

  const closeNavigation = useCallback(() => {
    setShowSideBar(false);
  }, [setShowSideBar]);

  function renderSideBar() {
    if (showSideBar) {
      return <SidebarNavigation fullscreen closeSideBar={closeNavigation} />;
    }

    return null;
  }

  function renderLogo() {
    if (isLandingPage) {
      return (
        <div className={styles.flag}>
          <Link href="/home" passHref>
            <a href="*">
              <Icon width={92} name="appLogo" />
            </a>
          </Link>
        </div>
      );
    }

    return null;
  }

  function renderDaoButtons() {
    if (isLandingPage) {
      return (
        <>
          <div className={cn(styles.communities, styles.desktopOnly)}>
            <Button
              size="small"
              variant="tertiary"
              onClick={() => {
                router.push(ALL_DAOS_URL);
              }}
            >
              Communities
            </Button>
          </div>
        </>
      );
    }

    return null;
  }

  return (
    <header className={styles.root}>
      {renderSideBar()}
      <div className={styles.mobileMenu}>
        <Icon
          name="hamburger"
          className={styles.hamburgerIcon}
          onClick={openNavigation}
        />
      </div>
      {renderLogo()}
      <div className={cn(styles.search, styles.desktopOnly)}>
        <SearchBar />
      </div>
      {renderDaoButtons()}
      <div className={styles.signIn}>
        <AccountButton />
      </div>
    </header>
  );
};
