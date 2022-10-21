import React, { FC, ReactNode, useCallback, useMemo } from 'react';
import clsx from 'classnames';
import { useTranslation } from 'next-i18next';
import isEmpty from 'lodash/isEmpty';

import { useProposalsInfinite } from 'services/ApiService/hooks/useProposals';

import { ViewProposal } from 'astro_2.0/features/ViewProposal';

import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

import { Loader } from 'components/loader';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Feed as FeedList } from 'astro_2.0/components/Feed';
import { ProposalsFeedFilters } from 'astro_3.0/features/ProposalsFeedNext/components/ProposalsFeedFilters';

import { ProposalFeedItem } from 'types/proposal';

import styles from './DaoProposalsFeed.module.scss';

interface Props {
  className?: string;
  children?: ReactNode;
}

export const DaoProposalsFeed: FC<Props> = ({ className, children }) => {
  const { t } = useTranslation();
  const { size, setSize, data, isValidating } = useProposalsInfinite();

  const handleFilterChange = useCallback(() => {
    window.scroll(0, 0);
  }, []);

  const handleLoadMore = useCallback(() => setSize(size + 1), [setSize, size]);

  const proposalsData = useMemo(() => {
    return {
      data:
        data?.reduce<ProposalFeedItem[]>((acc, item) => {
          acc.push(...item.data);

          return acc;
        }, []) ?? [],
      total: 0,
      page: 0,
      count: 0,
      pageCount: 0,
    };
  }, [data]);

  return (
    <div className={clsx(styles.root, className)}>
      <ProposalsFeedFilters
        className={styles.filtersContainer}
        onFilterChange={handleFilterChange}
      />
      {children}
      {isValidating && !proposalsData.data.length && <Loader />}
      <FeedList
        data={proposalsData}
        dataLength={data?.length ?? 0}
        hasMore={
          data
            ? data[data?.length - 1].data.length === LIST_LIMIT_DEFAULT
            : false
        }
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
