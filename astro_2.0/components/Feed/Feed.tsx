import React from 'react';
import cn from 'classnames';
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
}: FeedProps<T>): React.ReactElement => {
  return (
    <div className={cn(styles.root, className)}>
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
