import React, { FC, ReactNode, useCallback, useMemo } from 'react';
import clsx from 'classnames';
import { useTranslation } from 'next-i18next';
import isEmpty from 'lodash/isEmpty';

import { useProposalsInfinite } from 'services/ApiService/hooks/useProposals';

import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { MainLayout } from 'astro_3.0/features/MainLayout';
import { FeedControlsLayout } from 'astro_3.0/features/FeedLayout';

import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

import { Loader } from 'components/loader';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Feed as FeedList } from 'astro_2.0/components/Feed';

import { ProposalFeedItem } from 'types/proposal';

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
  const { size, setSize, data, isValidating } = useProposalsInfinite(isMyFeed);

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
      </MainLayout>
    </main>
  );
};
