import { FC } from 'react';

import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import styles from './NoSearchResultsView.module.scss';

interface NoSearchResultsViewProps {
  query?: string;
}

export const NoSearchResultsView: FC<NoSearchResultsViewProps> = ({
  query,
}) => {
  const title = query ? `No results for ${query}` : 'No results';

  return (
    <NoResultsView
      title={title}
      className={styles.root}
      imgClassName={styles.image}
      subTitle="We couldn't find anything matching your search. Try again with a
        different term."
    />
  );
};
