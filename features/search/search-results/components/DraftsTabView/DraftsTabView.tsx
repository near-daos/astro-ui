import React from 'react';

import { Highlighter } from 'features/search/search-results/components/highlighter';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { useSearchResults } from 'features/search/search-results/SearchResults';

import styles from './DraftsTabView.module.scss';

export const DraftsTabView: React.FC = () => {
  const { searchResults } = useSearchResults();
  const { query, drafts } = searchResults || {};

  return (
    <div className={styles.root}>
      <div className={styles.listWrapper}>
        {drafts?.length ? (
          <Highlighter className={styles.highlighterRoot}>
            {drafts.map(item => {
              return (
                <div className={styles.cardWrapper} key={item.id}>
                  <div>{item.title}</div>
                </div>
              );
            })}
          </Highlighter>
        ) : (
          <NoResultsView
            title={query ? `No results for ${query}` : 'No results'}
            subTitle="We couldn't find anything matching your search. Try again with a
        different term."
          />
        )}
      </div>
    </div>
  );
};
