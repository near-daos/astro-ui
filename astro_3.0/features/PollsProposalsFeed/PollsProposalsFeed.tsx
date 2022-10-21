import React, { FC } from 'react';
import clsx from 'classnames';
import { useTranslation } from 'next-i18next';
import isEmpty from 'lodash/isEmpty';

import { ViewProposal } from 'astro_2.0/features/ViewProposal';

import { Loader } from 'components/loader';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Feed as FeedList } from 'astro_2.0/components/Feed';
import { ProposalsFeedFilters } from 'astro_3.0/features/ProposalsFeedNext/components/ProposalsFeedFilters';

import { ProposalCategories } from 'types/proposal';

import { useProposalsFeed } from 'astro_3.0/features/ProposalsFeedNext/hooks';

import styles from './PollsProposalsFeed.module.scss';

interface Props {
  className?: string;
}

export const PollsProposalsFeed: FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const {
    handleFilterChange,
    handleLoadMore,
    proposalsData,
    isValidating,
    hasMore,
    dataLength,
  } = useProposalsFeed({
    category: ProposalCategories.Polls,
  });

  return (
    <div className={clsx(styles.root, className)}>
      <ProposalsFeedFilters
        className={styles.filtersContainer}
        onFilterChange={handleFilterChange}
        hideCategories
      />
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
    </div>
  );
};
