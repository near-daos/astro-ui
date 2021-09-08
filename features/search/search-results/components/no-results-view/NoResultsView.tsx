import React, { FC } from 'react';

import styles from './no-results-view.module.scss';

interface NoResultsViewProps {
  query?: string;
}

export const NoResultsView: FC<NoResultsViewProps> = ({ query }) => {
  return (
    <div className={styles.root}>
      <div className={styles.image} />
      <div className={styles.title}>
        No results {query ? `for '${query}'` : ''}
      </div>
      <div className={styles.desc}>
        We couldn&apos;t find anything matching your search. Try again with a
        different term.
      </div>
    </div>
  );
};
