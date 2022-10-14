import React from 'react';
import cn from 'classnames';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AnimatePresence, motion } from 'framer-motion';

import { PaginationResponse } from 'types/api';

import { ProposalControlButton } from 'astro_2.0/components/ProposalCardRenderer/components/ProposalCard/components/ProposalControlPanel/components/ProposalControlButton';
import { Button } from 'components/button/Button';

import { useMultiVoteActions } from 'astro_2.0/components/Feed/hooks';

import styles from './Feed.module.scss';

type FeedProps<T> = {
  className?: string;
  data: PaginationResponse<T[]>;
  loader: React.ReactElement;
  noResults: React.ReactElement;
  renderItem: (
    item: T,
    onSelect: (p: string) => void,
    selectedList: string[]
  ) => React.ReactElement;
  loadMore: () => void;
  hasMore?: boolean;
  dataLength?: number;
};

export const Feed = <T,>({
  className,
  data,
  loader,
  noResults,
  renderItem,
  loadMore,
  hasMore,
  dataLength,
}: FeedProps<T>): React.ReactElement | null => {
  const { handleVote, handleSelect, handleDismiss, list } =
    useMultiVoteActions();

  if (!data.data) {
    return null;
  }

  return (
    <div className={cn(styles.root, className)}>
      <InfiniteScroll
        dataLength={dataLength !== undefined ? dataLength : data.data.length}
        next={loadMore}
        hasMore={
          hasMore !== undefined ? hasMore : data.data.length < data.total
        }
        loader={loader}
        style={{ overflow: 'initial' }}
        endMessage={noResults}
      >
        {data.data.map(item => renderItem(item, handleSelect, list))}
      </InfiniteScroll>

      <div className={styles.selection}>
        <AnimatePresence>
          {!!list.length && (
            <motion.div
              initial={{ opacity: 0, transform: 'translateY(60px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              exit={{ opacity: 0, transform: 'translateY(60px)' }}
            >
              <div className={styles.panel}>
                <span className={styles.details}>
                  <span className={styles.value}>{list.length}</span>
                  <span className={styles.label}>
                    Proposal{list.length > 1 ? 's' : ''} selected
                  </span>
                </span>

                <span className={styles.controls}>
                  <ProposalControlButton
                    icon="votingYes"
                    times={null}
                    type="button"
                    disabled={false}
                    onClick={() => handleVote('VoteApprove')}
                    className={styles.controlButton}
                  />
                  <ProposalControlButton
                    icon="votingNo"
                    type="button"
                    times={null}
                    disabled={false}
                    onClick={() => handleVote('VoteReject')}
                    className={styles.controlButton}
                  />
                  <Button
                    capitalize
                    size="small"
                    variant="tertiary"
                    className={styles.dismiss}
                    onClick={handleDismiss}
                  >
                    Dismiss
                  </Button>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
