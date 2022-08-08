import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { useAsyncFn, useMountedState } from 'react-use';
import { useRouter } from 'next/router';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
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

// Constants
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

// Components
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Feed as FeedList } from 'astro_2.0/components/Feed';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { Loader } from 'components/loader';
import { ProposalsFeedFilters } from 'astro_3.0/features/ProposalsFeed/components/ProposalsFeedFilters';

// Hooks
import { useWalletContext } from 'context/WalletContext';
import { useDebounceEffect } from 'hooks/useDebounceUpdateEffect';

// Services
import { SputnikHttpService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';

// Constants
import { FEED_STATUS_COOKIE } from 'constants/cookies';

import styles from './ProposalsFeed.module.scss';

interface Props {
  dao?: DAO;
  showFlag?: boolean;
  className?: string;
  title?: ReactNode | string;
  category?: ProposalCategories;
  initialProposals: PaginationResponse<ProposalFeedItem[]> | null;
  initialProposalsStatusFilterValue: ProposalsFeedStatuses;
}

export const ProposalsFeed = ({
  dao,
  title,
  category,
  className,
  showFlag = true,
  initialProposals,
  initialProposalsStatusFilterValue,
}: Props): JSX.Element => {
  const { query, replace, pathname } = useRouter();
  const { t } = useTranslation();
  const isMounted = useMountedState();

  const queries = query as ProposalsQueries;
  const lastFeedStatus = CookieService.get(FEED_STATUS_COOKIE);

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

      const res = dao
        ? await SputnikHttpService.getProposalsList({
            offset: accumulatedListData?.data.length || 0,
            limit: LIST_LIMIT_DEFAULT,
            daoId: dao?.id,
            category: category || queries.category,
            status,
            accountId,
          })
        : await SputnikHttpService.getProposalsListByAccountId(
            {
              offset: accumulatedListData?.data.length || 0,
              limit: LIST_LIMIT_DEFAULT,
              category: queries.category,
              status,
              daoFilter: 'All DAOs',
              accountId,
            },
            isMyFeed && accountId ? accountId : undefined
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

  const onProposalFilterChange = useCallback(
    async (value: string) => {
      const nextQuery = {
        ...queries,
        status: value as ProposalsFeedStatuses,
      } as ProposalsQueries;

      // We use custom loading flag here and not the existing proposalsDataIsLoading because
      // we want loader to be visible immediately once we click on radio button
      // which is not possible using existing proposalsDataIsLoading flag
      if (isMounted()) {
        setLoading(true);
      }

      CookieService.set(
        FEED_STATUS_COOKIE,
        Object.values(ProposalsFeedStatuses).includes(
          value as ProposalsFeedStatuses
        )
          ? value
          : ProposalsFeedStatuses.All,
        { path: '/' }
      );

      await replace(
        {
          query: nextQuery,
        },
        undefined,
        { shallow: false, scroll: false }
      );
    },
    [isMounted, queries, replace]
  );

  useEffect(() => {
    if (status !== lastFeedStatus) {
      onProposalFilterChange(lastFeedStatus);
    }
  }, [lastFeedStatus, onProposalFilterChange, status]);

  return (
    <main className={cn(styles.root, className)}>
      <Head>
        <title>
          Astro - Proposals Feed - {status} - {queries.category}
        </title>
      </Head>

      <ProposalsFeedFilters className={styles.filtersContainer} />

      <div className={styles.container}>
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
    </main>
  );
};
