import React from 'react';
import cn from 'classnames';
import Head from 'next/head';
import InfiniteScroll from 'react-infinite-scroll-component';

import { PaginationResponse } from 'types/api';

import styles from './Feed.module.scss';

type FeedProps<T> = {
  className?: string;
  data: PaginationResponse<T[]>;
  loader: React.ReactElement;
  noResults: React.ReactElement;
  renderItem: (item: T) => React.ReactElement;
  loadMore: () => void;
};

export const Feed = <T,>({
  className,
  data,
  loader,
  noResults,
  renderItem,
  loadMore,
}: FeedProps<T>): React.ReactElement | null => {
  if (!data.data) {
    return null;
  }

  return (
    <div className={cn(styles.root, className)}>
      <Head>
        <title>Astro</title>
        <meta name="viewport" content="width=device-width, minimum-scale=1" />
      </Head>
      <InfiniteScroll
        dataLength={data.data.length}
        next={loadMore}
        hasMore={data.data.length < data.total}
        loader={loader}
        style={{ overflow: 'initial' }}
        endMessage={noResults}
      >
        {data.data.map(renderItem)}
      </InfiniteScroll>
    </div>
  );
};
