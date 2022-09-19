import React from 'react';

import { Highlighter } from 'features/search/search-results/components/highlighter';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { useSearchResults } from 'features/search/search-results/SearchResults';

import styles from './CommentsTabView.module.scss';

export const CommentsTabView: React.FC = () => {
  const { searchResults } = useSearchResults();
  const { query, comments } = searchResults || {};

  return (
    <div className={styles.root}>
      <div className={styles.listWrapper}>
        {comments?.length ? (
          <Highlighter className={styles.highlighterRoot}>
            {comments.map(item => {
              return (
                <div className={styles.cardWrapper} key={item.id}>
                  <div>{item.message}</div>
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
