import React, { FC } from 'react';

import { AppHeader } from 'astro_2.0/components/AppHeader';
import { SearchResults } from 'features/search/search-results';
import { NotificationContainer } from 'features/notifications';

import styles from './page-layout.module.scss';

const PageLayout: FC = ({ children }) => {
  return (
    <div className={styles.root}>
      <SearchResults>
        <div className={styles.content}>
          <AppHeader />
          <div className={styles.main}>{children}</div>
        </div>
      </SearchResults>

      <NotificationContainer />
    </div>
  );
};

export default PageLayout;
