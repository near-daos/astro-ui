import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

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
          <Icon name="proposalGovernance" className={styles.logo} />
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
                router.push('/all-communities');
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
