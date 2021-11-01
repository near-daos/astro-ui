import React, { FC } from 'react';

import { NotificationContainer } from 'features/notifications';
import { AppFooter } from 'features/app-footer';
import { SearchResults } from 'features/search/search-results';

import styles from './create-layout.module.scss';

const CreateLayout: FC = ({ children }) => {
  return (
    <div className={styles.root}>
      <SearchResults>
        <main className={styles.main}>{children}</main>
        <NotificationContainer />
      </SearchResults>
      <AppFooter isLandingPage />
    </div>
  );
};

export default CreateLayout;
