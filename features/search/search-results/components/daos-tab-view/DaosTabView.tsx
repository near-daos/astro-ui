import React from 'react';

import { NoResultsView } from 'features/no-results-view';
import { useSearchResults } from 'features/search/search-results/SearchResults';
import { Highlighter } from 'features/search/search-results/components/highlighter';
import { DaoDetails } from 'astro_2.0/components/DaoDetails';

import styles from './dao-tab-view.module.scss';

export const DaosTabView = (): JSX.Element => {
  const { searchResults } = useSearchResults();

  if ((searchResults?.daos || []).length === 0) {
    return (
      <NoResultsView
        title={
          searchResults?.query
            ? `No results for ${searchResults.query}`
            : 'No results'
        }
        subTitle="We couldn't find anything matching your search. Try again with a
        different term."
      />
    );
  }

  return (
    <div className={styles.root}>
      <Highlighter>
        {searchResults?.daos.map(item => (
          <React.Fragment key={item.id}>
            <DaoDetails
              key={item.id}
              dao={item}
              activeProposals={item.activeProposalsCount}
              totalProposals={item.totalProposalsCount}
            />
            <div className={styles.divider} />
          </React.Fragment>
        ))}
      </Highlighter>
    </div>
  );
};
