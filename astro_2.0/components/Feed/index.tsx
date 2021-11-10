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
import * as Typography from 'components/Typography';
import { NoResultsView } from 'features/no-results-view';
import FeedList from 'astro_2.0/features/Feed';

import CategoriesList from './CategoriesList';
import StatusFilters from './StatusFilters';

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

  const onProposalFilterChange = (value?: string) => async () => {
    const nextQuery = {
      ...queries,
      status: value as ProposalStatuses,
    } as ProposalsQueries;

    if (!value) {
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
        <Typography.Title className={styles.title} size={2}>
          {isMyFeed ? 'My ' : 'Astro '}proposals feed
        </Typography.Title>

        <StatusFilters
          proposal={queries.status}
          onChange={onProposalFilterChange}
          disabled={proposalsDataIsLoading}
          list={[
            { value: undefined, label: 'All', name: 'All' },
            {
              value: ProposalStatuses.Active,
              label: 'Active',
              name: ProposalStatuses.Active,
            },
            {
              value: ProposalStatuses.Approved,
              label: 'Approved',
              name: ProposalStatuses.Approved,
              classes: {
                inputWrapperChecked:
                  styles.categoriesListApprovedInputWrapperChecked,
              },
            },
            {
              value: ProposalStatuses.Failed,
              label: 'Failed',
              name: ProposalStatuses.Failed,
              classes: {
                inputWrapperChecked:
                  styles.categoriesListFailedInputWrapperChecked,
              },
            },
          ]}
          className={styles.categoriesListRoot}
        />
      </div>

      <div className={styles.container}>
        <div className={styles.categoriesListWrapper}>
          <CategoriesList
            query={queries}
            queryName="category"
            disabled={proposalsDataIsLoading}
            className={styles.categoriesListRoot}
          />
        </div>

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
