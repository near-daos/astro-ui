import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAsync, useAsyncFn, useUpdateEffect } from 'react-use';
import InfiniteScroll from 'react-infinite-scroll-component';

import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { PaginationResponse } from 'types/api';
import { Proposal, ProposalStatuses } from 'types/proposal';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { ProposalsQueries } from 'services/sputnik/types/proposals';
import { SputnikHttpService } from 'services/sputnik';
import { useDebounceUpdateEffect } from 'hooks/useDebounceUpdateEffect';
import { useAuthContext } from 'context/AuthContext';
import { useCustomTokensContext } from 'context/CustomTokensContext';
import { NoResultsView } from 'features/no-results-view';
import * as Typography from 'components/Typography';

import { Loader } from 'components/loader';
import CategoriesList from './CategoriesList';
import StatusFilters from './StatusFilters';

import styles from './Feed.module.scss';

const Feed = ({ initialProposals }: Props): JSX.Element => {
  const { query, replace, pathname } = useRouter();

  const { fetchAndSetTokens } = useCustomTokensContext();

  const queries = query as ProposalsQueries;

  const isMyFeed = pathname.startsWith('/my/feed');

  const queryBeignFetched = useRef(queries);

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

  useUpdateEffect(() => {
    Promise.resolve().then(async () => {
      queryBeignFetched.current = queries;

      setProposalsData(await fetchProposalsData());

      window.scroll(0, 0);
    });
  }, [isMyFeed]);

  useDebounceUpdateEffect(
    async () => {
      if (
        queryBeignFetched.current.category === queries.category &&
        queryBeignFetched.current.status === queries.status
      ) {
        return;
      }

      queryBeignFetched.current = queries;

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

  const isEmptyList = (proposalsData?.data || []).length === 0;

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

        <InfiniteScroll
          dataLength={proposalsData?.data.length || 0}
          next={loadMore}
          hasMore={
            (proposalsData?.data.length || 0) < (proposalsData?.total || 0)
          }
          loader={<h4 className={styles.loading}>Loading...</h4>}
          style={{ overflow: 'initial' }}
          endMessage={
            !isEmptyList && (
              <p className={styles.loading}>
                <b>You have seen it all</b>
              </p>
            )
          }
        >
          {(proposalsData?.data || []).map(item => {
            return (
              <div key={item.id} className={styles.itemRoot}>
                <ViewProposal dao={item.dao} proposal={item} showFlag />
              </div>
            );
          })}

          {isEmptyList && proposalsDataIsLoading && <Loader />}

          {isEmptyList && !proposalsDataIsLoading && (
            <NoResultsView title="No proposals here" />
          )}
        </InfiniteScroll>
      </div>
    </main>
  );
};

type Props = {
  initialProposals: PaginationResponse<Proposal[]> | null;
};

export default Feed;
