import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import { useAsyncFn, useMount, useMountedState } from 'react-use';
import { useRouter } from 'next/router';
import React, {
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { HeaderWithFilter } from 'astro_2.0/features/dao/HeaderWithFilter';
import { ProposalFilter } from 'astro_2.0/features/Proposals/components/ProposalFilter';
import { SideFilter } from 'astro_2.0/components/SideFilter';
import { Loader } from 'components/loader';

// Hooks
import { useWalletContext } from 'context/WalletContext';
import { useDebounceEffect } from 'hooks/useDebounceUpdateEffect';
import { getStatusFilterOptions } from 'astro_2.0/features/Proposals/helpers/getStatusFilterOptions';

// Constants
import { FEED_CATEGORIES } from 'constants/proposals';

import { getProposalsList } from 'features/proposal/helpers';

import styles from './Feed.module.scss';

interface FeedProps {
  dao?: DAO;
  showFlag?: boolean;
  className?: string;
  title?: ReactNode | string;
  category?: ProposalCategories;
  headerClassName?: string;
  initialProposals?: PaginationResponse<ProposalFeedItem[]> | null;
  initialProposalsStatusFilterValue?: ProposalsFeedStatuses;
}

export const Feed = ({
  dao,
  title,
  category,
  className,
  showFlag = true,
  headerClassName,
  initialProposals = null,
  initialProposalsStatusFilterValue,
}: FeedProps): JSX.Element => {
  const neighbourRef = useRef(null);
  const { query, replace, pathname } = useRouter();
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

  const statusFilterOptions = useMemo(
    () => getStatusFilterOptions(isMyFeed, t),
    [isMyFeed, t]
  );

  const feedCategoriesOptions = useMemo(
    () =>
      FEED_CATEGORIES.map(item => ({
        ...item,
        label: t(item.label.toLowerCase()),
      })),
    [t]
  );

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
    1000,
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

      await replace(
        {
          query: nextQuery,
        },
        undefined,
        { shallow: true, scroll: false }
      );
    },
    [isMounted, queries, replace]
  );

  function renderTitle() {
    if (isString(title)) {
      return <h1 className={styles.title}>{title}</h1>;
    }

    return title;
  }

  return (
    <main className={cn(styles.root, className)}>
      <Head>
        <title>
          Astro - {title} - {status} - {queries.category}
        </title>
        <meta name="viewport" content="width=device-width, minimum-scale=1" />
      </Head>
      <HeaderWithFilter
        title={renderTitle()}
        titleRef={neighbourRef}
        className={cn(styles.statusFilterWrapper, headerClassName)}
      >
        <ProposalFilter
          title={`${t('filterByProposalStatus')}:`}
          shortTitle={`${t('filterByStatus')}:`}
          neighbourRef={neighbourRef}
          value={status}
          onChange={onProposalFilterChange}
          disabled={proposalsDataIsLoading}
          list={statusFilterOptions}
        />
      </HeaderWithFilter>

      <div className={styles.container}>
        {!category && (
          <SideFilter
            queryName="category"
            list={feedCategoriesOptions}
            title={t('feed.filters.chooseAFilter')}
            disabled={proposalsDataIsLoading}
            titleClassName={styles.categoriesListTitle}
            shallowUpdate
          />
        )}

        {loading ? (
          <Loader className={styles.loader} />
        ) : (
          <>
            {proposalsData && (
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
            )}
          </>
        )}
      </div>
    </main>
  );
};
