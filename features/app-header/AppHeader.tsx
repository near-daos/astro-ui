import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';

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
  const [showSideBar, setShowSideBar] = useState(false);

  const openNavigation = useCallback(() => {
    setShowSideBar(true);
  }, [setShowSideBar]);

  const closeNavigation = useCallback(() => {
    setShowSideBar(false);
  }, [setShowSideBar]);

  return (
    <header className={styles.root}>
      {showSideBar && (
        <SidebarNavigation fullscreen closeSideBar={closeNavigation} />
      )}
      <div className={styles.mobileMenu}>
        <Icon
          name="hamburger"
          className={styles.hamburgerIcon}
          onClick={openNavigation}
        />
      </div>
      {isLandingPage && (
        <div className={styles.flag}>
          <Icon name="proposalGovernance" className={styles.logo} />
        </div>
      )}
      <div className={cn(styles.search, styles.desktopOnly)}>
        <SearchBar />
      </div>
      {isLandingPage && (
        <>
          <div className={cn(styles.communities, styles.desktopOnly)}>
            <Button size="small" variant="tertiary">
              Communities
            </Button>
          </div>
          <div className={cn(styles.createDao, styles.desktopOnly)}>
            <Button size="small" variant="secondary">
              Create DAO
            </Button>
          </div>
        </>
      )}
      <div className={styles.signIn}>
        <AccountButton />
      </div>
    </header>
  );
};
