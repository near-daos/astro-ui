import { FC } from 'react';

import { NoResultsView } from 'astro_2.0/components/NoResultsView';

interface NoSearchResultsViewProps {
  query?: string;
}

export const NoSearchResultsView: FC<NoSearchResultsViewProps> = ({
  query,
}) => {
  const title = query ? 'No results' : `No results for ${query}`;

  return (
    <NoResultsView
      title={title}
      subTitle="We couldn't find anything matching your search. Try again with a
        different term."
    />
  );
};
