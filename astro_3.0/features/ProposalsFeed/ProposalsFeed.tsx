import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { useAsyncFn, useMount, useMountedState } from 'react-use';
import { useRouter } from 'next/router';
import React, { ReactElement, ReactNode, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

// Types
import { DAO } from 'types/dao';
import { PaginationResponse } from 'types/api';
import { ProposalsQueries } from 'services/sputnik/types/proposals';
import {
  ProposalCategories,
  ProposalFeedItem,
  ProposalsFeedStatuses,
} from 'types/proposal';

// Components
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Feed as FeedList } from 'astro_2.0/components/Feed';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { Loader } from 'components/loader';
import { ProposalsFeedFilters } from 'astro_3.0/features/ProposalsFeed/components/ProposalsFeedFilters';

// Hooks
import { useWalletContext } from 'context/WalletContext';
import { useDebounceEffect } from 'hooks/useDebounceUpdateEffect';

import { MainLayout } from 'astro_3.0/features/MainLayout';
import { FeedControlsLayout } from 'astro_3.0/features/FeedLayout';

import { getProposalsList } from 'features/proposal/helpers';

import styles from './ProposalsFeed.module.scss';

interface Props {
  dao?: DAO;
  showFlag?: boolean;
  className?: string;
  title?: ReactNode | string;
  category?: ProposalCategories;
  initialProposals: PaginationResponse<ProposalFeedItem[]> | null;
  initialProposalsStatusFilterValue: ProposalsFeedStatuses;
  children?: ReactElement;
}

export const ProposalsFeed = ({
  dao,
  title,
  category,
  className,
  showFlag = true,
  initialProposals,
  initialProposalsStatusFilterValue,
  children,
}: Props): JSX.Element => {
  const { query, pathname } = useRouter();
  const { t } = useTranslation();
  const isMounted = useMountedState();

  const queries = query as ProposalsQueries;

  const status =
    (query.status as ProposalsFeedStatuses) ||
    initialProposalsStatusFilterValue ||
    ProposalsFeedStatuses.All;

  const isMyFeed = pathname.startsWith('/my');

  const { accountId } = useWalletContext();

  const [proposalsData, setProposalsData] = useState(initialProposals);

  const [loading, setLoading] = useState(false);

  const [{ loading: proposalsDataIsLoading }, fetchProposalsData] = useAsyncFn(
    async (initialData?: typeof proposalsData) => {
      let accumulatedListData = initialData || null;

      const res = await getProposalsList(
        accumulatedListData,
        status,
        category || queries.category,
        accountId,
        dao?.id ?? '',
        isMyFeed
      );

      if (!res) {
        return null;
      }

      accumulatedListData = {
        ...res,
        data: [...(accumulatedListData?.data || []), ...(res.data || [])],
      };

      // Reset custom loading state
      if (isMounted()) {
        setLoading(false);
      }

      return accumulatedListData;
    },
    [proposalsData?.data?.length, status, queries.category, accountId, isMyFeed]
  );

  useDebounceEffect(
    async ({ isInitialCall, depsHaveChanged }) => {
      if (isInitialCall || !depsHaveChanged) {
        return;
      }

      const newProposalsData = await fetchProposalsData();

      if (isMounted()) {
        setProposalsData(newProposalsData);
      }

      window.scroll(0, 0);
    },
    500,
    [queries.category, status]
  );

  const loadMore = async () => {
    if (proposalsDataIsLoading) {
      return;
    }

    const newProposalsData = await fetchProposalsData(proposalsData);

    if (isMounted()) {
      setProposalsData(newProposalsData);
    }
  };

  useMount(() => {
    loadMore();
  });

  return (
    <main className={cn(styles.root, className)}>
      <Head>
        <title>
          Astro - Proposals Feed - {status} - {queries.category}
        </title>
      </Head>

      <FeedControlsLayout>
        <ProposalsFeedFilters className={styles.filtersContainer} />
      </FeedControlsLayout>

      <MainLayout>
        <div className={styles.container}>
          {children}
          {loading ? (
            <Loader className={styles.loader} />
          ) : (
            proposalsData && (
              <FeedList
                data={proposalsData}
                loadMore={loadMore}
                loader={<p className={styles.loading}>{t('loading')}...</p>}
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
                      showFlag={showFlag}
                      onSelect={onSelect}
                      selectedList={selectedList}
                    />
                  </div>
                )}
                className={styles.listWrapper}
              />
            )
          )}
        </div>
      </MainLayout>
    </main>
  );
};
