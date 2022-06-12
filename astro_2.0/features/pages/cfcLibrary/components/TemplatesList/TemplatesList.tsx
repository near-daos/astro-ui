import React, { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { TemplatesListItem } from 'astro_2.0/features/pages/cfcLibrary/components/TemplatesList/components/TemplatesListItem';

import { SharedProposalTemplate } from 'types/proposalTemplate';

import styles from './TemplatesList.module.scss';

interface Props {
  total: number;
  data: SharedProposalTemplate[] | null;
  next: () => void;
}

export const TemplatesList: FC<Props> = ({ total, data, next }) => {
  if (!data) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.name}>Name</div>
        <div className={styles.creator}>Creator</div>
        <div className={styles.duplicated}>Duplicated</div>
        <div className={styles.control}>&nbsp;</div>
      </div>
      <InfiniteScroll
        dataLength={data.length}
        next={next}
        hasMore={data.length < total}
        loader={
          <div className={styles.loadingMore}>
            <LoadingIndicator />
          </div>
        }
        style={{ overflow: 'initial' }}
        endMessage=""
      >
        {data.map(item => (
          <TemplatesListItem data={item} key={item.id} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
