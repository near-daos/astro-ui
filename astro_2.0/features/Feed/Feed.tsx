import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import { useAsyncFn, useMountedState } from 'react-use';
import { useRouter } from 'next/router';
import React, { ReactNode, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';

// Types
import { DAO } from 'types/dao';
import { PaginationResponse } from 'types/api';
import { ProposalsQueries } from 'services/sputnik/types/proposals';
import { Proposal, ProposalStatuses, ProposalCategories } from 'types/proposal';

// Constants
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

// Components
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Feed as FeedList } from 'astro_2.0/components/Feed';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { HeaderWithFilter } from 'astro_2.0/features/dao/HeaderWithFilter';
import { ProposalStatusFilter } from 'astro_2.0/features/Proposals/components/ProposalStatusFilter';
import { SideFilter } from 'astro_2.0/components/SideFilter';
import { Loader } from 'components/loader';

// Hooks
import { useAuthContext } from 'context/AuthContext';
import { useAllCustomTokens } from 'hooks/useCustomTokens';
import { useDebounceEffect } from 'hooks/useDebounceUpdateEffect';

// Services
import { SputnikHttpService } from 'services/sputnik';

// Local Constants
import { FEED_CATEGORIES } from './constants';

import styles from './Feed.module.scss';

interface FeedProps {
  dao?: DAO;
  showFlag?: boolean;
  className?: string;
  title?: ReactNode | string;
  category?: ProposalCategories;
  headerClassName?: string;
  initialProposals: PaginationResponse<Proposal[]> | null;
  initialProposalsStatusFilterValue: ProposalStatuses;
}

export const Feed = ({
  dao,
  title,
  category,
  className,
  showFlag = true,
  headerClassName,
  initialProposals,
  initialProposalsStatusFilterValue,
}: FeedProps): JSX.Element => {
  const neighbourRef = useRef(null);
  const { query, replace, pathname } = useRouter();
  const { tokens: allTokens } = useAllCustomTokens();
  const { t } = useTranslation();
  const isMounted = useMountedState();

  const queries = query as ProposalsQueries;

  const status =
    (query.status as ProposalStatuses) ||
    initialProposalsStatusFilterValue ||
    ProposalStatuses.All;

  const isMyFeed = pathname.startsWith('/my/feed');

  const { accountId } = useAuthContext();

  const [proposalsData, setProposalsData] = useState(initialProposals);

  const [loading, setLoading] = useState(false);

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

      const res = dao
        ? await SputnikHttpService.getProposalsList({
            offset: accumulatedListData?.data.length || 0,
            limit: LIST_LIMIT_DEFAULT,
            daoId: dao?.id,
            category: category || queries.category,
            status,
          })
        : await SputnikHttpService.getProposalsList(
            {
              offset: accumulatedListData?.data.length || 0,
              limit: LIST_LIMIT_DEFAULT,
              category: queries.category,
              status,
              daoFilter: 'All DAOs',
            },
            isMyFeed && accountId ? accountId : undefined
          );

      accumulatedListData = {
        ...res,
        data: [...(accumulatedListData?.data || []), ...res.data],
      };

      // Reset custom loading state
      if (isMounted()) {
        setLoading(false);
      }

      return accumulatedListData;
    },
    [proposalsData?.data.length, status, queries.category, accountId, isMyFeed]
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

  const onProposalFilterChange = async (value: string) => {
    const nextQuery = {
      ...queries,
      status: value as ProposalStatuses,
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
      { shallow: false, scroll: false }
    );
  };

  function renderTitle() {
    if (isString(title)) {
      return <h1 className={styles.title}>{title}</h1>;
    }

    return title;
  }

  return (
    <main className={cn(styles.root, className)}>
      <HeaderWithFilter
        title={renderTitle()}
        titleRef={neighbourRef}
        className={cn(styles.statusFilterWrapper, headerClassName)}
      >
        <ProposalStatusFilter
          neighbourRef={neighbourRef}
          value={status}
          onChange={onProposalFilterChange}
          disabled={proposalsDataIsLoading}
          list={[
            { value: ProposalStatuses.All, label: t('feed.filters.all') },
            {
              value: ProposalStatuses.Active,
              label: t('feed.filters.active'),
            },
            {
              value: ProposalStatuses.Approved,
              label: t('feed.filters.approved'),
              className: styles.categoriesListApprovedInputWrapperChecked,
            },
            {
              value: ProposalStatuses.Failed,
              label: t('feed.filters.failed'),
              className: styles.categoriesListFailedInputWrapperChecked,
            },
          ]}
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
                renderItem={proposal => (
                  <div key={proposal.id} className={styles.proposalCardWrapper}>
                    <ViewProposal
                      dao={proposal.dao}
                      proposal={proposal}
                      showFlag={showFlag}
                      tokens={allTokens}
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
