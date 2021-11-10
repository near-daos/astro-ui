import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAsync, useAsyncFn } from 'react-use';

import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { PaginationResponse } from 'types/api';
import { Proposal, ProposalStatuses } from 'types/proposal';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { ProposalsQueries } from 'services/sputnik/types/proposals';
import { SputnikHttpService } from 'services/sputnik';
import { useDebounceEffect } from 'hooks/useDebounceUpdateEffect';
import { useAuthContext } from 'context/AuthContext';
import { useCustomTokensContext } from 'context/CustomTokensContext';
import { NoResultsView } from 'features/no-results-view';
import FeedList from 'astro_2.0/features/Feed';
import { ProposalStatusFilter } from 'astro_2.0/features/Proposals/components/ProposalStatusFilter';

import CategoriesList from './CategoriesList';

import styles from './Feed.module.scss';

const FeedPage = ({ initialProposals }: Props): JSX.Element => {
  const { query, replace, pathname } = useRouter();

  const { fetchAndSetTokens } = useCustomTokensContext();

  const queries = query as ProposalsQueries;

  const isMyFeed = pathname.startsWith('/my/feed');

  const { accountId } = useAuthContext();

  const [proposalsData, setProposalsData] = useState(initialProposals);

  useAsync(fetchAndSetTokens, []);

  const [{ loading: proposalsDataIsLoading }, fetchProposalsData] = useAsyncFn(
    async (initialData?: typeof proposalsData) => {
      let accumulatedListData = initialData || null;

      const res = await SputnikHttpService.getProposalsList(
        {
          offset: accumulatedListData?.data.length || 0,
          limit: LIST_LIMIT_DEFAULT,
          category: queries.category,
          status: queries.status,
          daoFilter: 'All DAOs',
        },
        isMyFeed && accountId ? accountId : undefined
      );

      accumulatedListData = {
        ...res,
        data: [...(accumulatedListData?.data || []), ...res.data],
      };

      return accumulatedListData;
    },
    [
      proposalsData?.data.length,
      queries.status,
      queries.category,
      accountId,
      isMyFeed,
    ]
  );

  useDebounceEffect(
    async ({ isInitialCall, depsHaveChanged }) => {
      if (isInitialCall || !depsHaveChanged) {
        return;
      }

      setProposalsData(await fetchProposalsData());

      window.scroll(0, 0);
    },
    1000,
    [queries.category, queries.status]
  );

  const loadMore = async () => {
    if (proposalsDataIsLoading) {
      return;
    }

    setProposalsData(await fetchProposalsData(proposalsData));
  };

  const onProposalFilterChange = async (value: string) => {
    const nextQuery = {
      ...queries,
      status: value as ProposalStatuses,
    } as ProposalsQueries;

    if (value === 'All') {
      delete nextQuery.status;
    }

    await replace(
      {
        query: nextQuery,
      },
      undefined,
      { shallow: true, scroll: false }
    );
  };

  return (
    <main className={styles.root}>
      <div className={styles.statusFilterWrapper}>
        <h1 className={styles.title}>
          {isMyFeed ? 'My ' : 'Astro '}proposals feed
        </h1>

        <ProposalStatusFilter
          value={queries.status || 'All'}
          onChange={onProposalFilterChange}
          disabled={proposalsDataIsLoading}
          list={[
            { value: 'All', label: 'All' },
            {
              value: ProposalStatuses.Active,
              label: 'Active',
            },
            {
              value: ProposalStatuses.Approved,
              label: 'Approved',
              className: styles.categoriesListApprovedInputWrapperChecked,
            },
            {
              value: ProposalStatuses.Failed,
              label: 'Failed',
              className: styles.categoriesListFailedInputWrapperChecked,
            },
          ]}
        />
      </div>

      <div className={styles.container}>
        <CategoriesList
          query={queries}
          queryName="category"
          disabled={proposalsDataIsLoading}
          className={styles.categoriesListRoot}
        />

        {proposalsData && (
          <FeedList
            data={proposalsData}
            loadMore={loadMore}
            loader={<p className={styles.loading}>Loading...</p>}
            noResults={
              <div className={styles.loading}>
                <NoResultsView title="No more results" />
              </div>
            }
            renderItem={proposal => (
              <div key={proposal.id} className={styles.proposalCardWrapper}>
                <ViewProposal dao={proposal.dao} proposal={proposal} showFlag />
              </div>
            )}
            className={styles.listWrapper}
          />
        )}
      </div>
    </main>
  );
};

type Props = {
  initialProposals: PaginationResponse<Proposal[]> | null;
};

export default FeedPage;
