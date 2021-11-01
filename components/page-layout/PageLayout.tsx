import React, { FC } from 'react';

import { AppHeader } from 'astro_2.0/components/AppHeader';
import { SidebarNavigation } from 'features/sidebar-navigation';
import { SearchResults } from 'features/search/search-results';
import { NotificationContainer } from 'features/notifications';

import styles from './page-layout.module.scss';

const PageLayout: FC = ({ children }) => {
  return (
    <div className={styles.root}>
      <SidebarNavigation className={styles.sideBar} />
      <SearchResults>
        <div className={styles.content}>
          <AppHeader />
          <main className={styles.main}>{children}</main>
          <NotificationContainer />
        </div>
      </SearchResults>
    </div>
  );
};

export default PageLayout;
