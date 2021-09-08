import React, { FC } from 'react';

import { SidebarNavigation } from 'features/sidebar-navigation';
import { AppHeader } from 'features/app-header';
import { AppFooter } from 'features/app-footer';
import { SearchResults } from 'features/search/search-results';

import styles from './page-layout.module.scss';

const PageLayout: FC = ({ children }) => {
  return (
    <div className={styles.root}>
      <SidebarNavigation className={styles.sideBar} />
      <SearchResults>
        {() => (
          <>
            <AppHeader isLandingPage={false} />
            <main className={styles.main}>{children}</main>
          </>
        )}
      </SearchResults>
      {/* todo - check if the user is logged in from auth service */}
      <AppFooter isLoggedIn={false} />
    </div>
  );
};

export default PageLayout;
