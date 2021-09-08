import React, { FC } from 'react';
import { AppHeader } from 'features/app-header';
import { AppFooter } from 'features/app-footer';
import {
  SearchResults,
  SearchResultsRenderer
} from 'features/search/search-results';

import styles from './create-layout.module.scss';

const CreateLayout: FC = ({ children }) => {
  return (
    <div className={styles.root}>
      <SearchResults>
        {({ searchResults }) => (
          <>
            <AppHeader isLandingPage />
            <main className={styles.main}>
              {searchResults ? <SearchResultsRenderer /> : children}
            </main>
          </>
        )}
      </SearchResults>
      <AppFooter isLandingPage />
    </div>
  );
};

export default CreateLayout;
