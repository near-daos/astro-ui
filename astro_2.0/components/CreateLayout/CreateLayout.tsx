import React, { FC } from 'react';

import { NotificationContainer } from 'features/notifications';
import { AppHeader } from 'features/app-header';
import { AppFooter } from 'features/app-footer';
import { SearchResults } from 'features/search/search-results';

import styles from './CreateLayout.module.scss';

const CreateLayout: FC = ({ children }) => {
  return (
    <div className={styles.root}>
      <SearchResults>
        <AppHeader isLandingPage />
        <main className={styles.main}>{children}</main>
        <NotificationContainer />
      </SearchResults>
      <AppFooter isLandingPage />
    </div>
  );
};

export default CreateLayout;
