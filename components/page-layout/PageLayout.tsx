import React, { FC } from 'react';

import { SidebarNavigation } from 'features/sidebar-navigation';
import { AppHeader } from 'features/app-header';
import { SearchResults } from 'features/search/search-results';
import { NotificationContainer } from 'features/notifications';

import styles from './page-layout.module.scss';

const PageLayout: FC = ({ children }) => {
  return (
    <div className={styles.root}>
      <SidebarNavigation className={styles.sideBar} />
      <SearchResults>
        <AppHeader isLandingPage={false} />
        <main className={styles.main}>{children}</main>
      </SearchResults>
      <NotificationContainer />
    </div>
  );
};

export default PageLayout;
