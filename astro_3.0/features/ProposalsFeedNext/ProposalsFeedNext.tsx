import React, { FC, ReactNode } from 'react';
import clsx from 'classnames';
import { useTranslation } from 'next-i18next';
import isEmpty from 'lodash/isEmpty';

import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { MainLayout } from 'astro_3.0/features/MainLayout';
import { FeedControlsLayout } from 'astro_3.0/features/FeedLayout';

import { Loader } from 'components/loader';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Feed as FeedList } from 'astro_2.0/components/Feed';

import { useProposalsFeed } from 'astro_3.0/features/ProposalsFeedNext/hooks';

import { ProposalsFeedFilters } from './components/ProposalsFeedFilters';

import styles from './ProposalsFeed.module.scss';

interface Props {
  className?: string;
  children?: ReactNode;
  isMyFeed?: boolean;
}

export const ProposalsFeedNext: FC<Props> = ({
  className,
  children,
  isMyFeed = false,
}) => {
  const { t } = useTranslation();
  const {
    handleFilterChange,
    handleLoadMore,
    proposalsData,
    isValidating,
    hasMore,
    dataLength,
  } = useProposalsFeed({
    isMyFeed,
  });

  return (
    <main className={clsx(styles.root, className)}>
      <FeedControlsLayout>
        <ProposalsFeedFilters
          className={styles.filtersContainer}
          onFilterChange={handleFilterChange}
        />
      </FeedControlsLayout>
      <MainLayout>
        {children}
        {isValidating && !proposalsData.data.length && <Loader />}
        <FeedList
          data={proposalsData}
          dataLength={dataLength}
          hasMore={hasMore}
          loadMore={handleLoadMore}
          loader={<Loader className={styles.loading}>{t('loading')}...</Loader>}
          noResults={
            <div className={styles.loading}>
              <NoResultsView
                title={
                  isEmpty(proposalsData?.data)
                    ? t('noProposalsHere')
                    : t('noMoreResults')
                }
              />
            </div>
          }
          renderItem={(proposal, onSelect, selectedList) => (
            <div
              key={`${proposal.id}_${proposal.updatedAt}`}
              className={styles.proposalCardWrapper}
            >
              <ViewProposal
                proposal={proposal}
                showFlag
                onSelect={onSelect}
                selectedList={selectedList}
              />
            </div>
          )}
          className={styles.listWrapper}
        />
      </MainLayout>
    </main>
  );
};
