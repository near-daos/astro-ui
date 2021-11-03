import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAsync, useAsyncFn, useToggle } from 'react-use';
import InfiniteScroll from 'react-infinite-scroll-component';

import { PaginationResponse } from 'types/api';
import { FeedCategories, Proposal, ProposalStatuses } from 'types/proposal';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { ProposalsQueries } from 'services/sputnik/types/proposals';
import { SputnikHttpService } from 'services/sputnik';
import { useDebounceUpdateEffect } from 'hooks/useDebounceUpdateEffect';
import { useAuthContext } from 'context/AuthContext';
import { useCustomTokensContext } from 'context/CustomTokensContext';
import { NoResultsView } from 'features/no-results-view';
import { getVoteDetails } from 'features/vote-policy/helpers';
import { getScope } from 'components/cards/expanded-proposal-card/helpers';

import { Loader } from 'components/loader';
import {
  ProposalCardRenderer,
  LetterHeadWidget,
  ProposalCard,
  // InfoBlockWidget,
} from 'astro_2.0/components/ProposalCardRenderer';

import { DaoFlagWidget } from 'astro_2.0/components/DaoFlagWidget';
import CategoriesList from './CategoriesList';
import StatusFilters from './StatusFilters';

import styles from './Feed.module.scss';

const Feed = ({ initialProposals }: Props): JSX.Element => {
  const { query, replace } = useRouter();

  const { fetchAndSetTokens } = useCustomTokensContext();

  const queries = query as ProposalsQueries;

  const [timelineView, toggleTimelineView] = useToggle(true);

  const queryBeignFetched = useRef(queries);

  const { accountId } = useAuthContext();

  const [proposalsData, setProposalsData] = useState(initialProposals);

  useAsync(fetchAndSetTokens, []);

  const [{ loading: proposalsDataIsLoading }, fetchProposalsData] = useAsyncFn(
    async (initialData?: typeof proposalsData) => {
      window.scroll(0, 0);

      let accumulatedListData = initialData || null;

      const res = await SputnikHttpService.getProposalsList({
        offset: accumulatedListData?.data.length || 0,
        limit: LIST_LIMIT_DEFAULT,
        category: queries.category,
        status: queries.status,
        daoFilter: 'All DAOs',
      });

      accumulatedListData = {
        ...res,
        data: [...(accumulatedListData?.data || []), ...res.data],
      };

      return accumulatedListData;
    },
    [proposalsData?.data.length, queries.status, queries.category, timelineView]
  );

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

  const onProposalFilterChange = async (value?: ProposalStatuses) => {
    const nextQuery = {
      ...queries,
      status: value,
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

  const isEmptyList =
    queryBeignFetched.current.category !== FeedCategories.Bounties &&
    (proposalsData?.data || []).length === 0;

  return (
    <main className={styles.root}>
      <div className={styles.statusFilterWrapper}>
        <StatusFilters
          proposal={queries.status}
          timelineView={timelineView}
          onChange={onProposalFilterChange}
          onTimelineChange={toggleTimelineView}
          disabled={proposalsDataIsLoading}
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
            (proposalsData?.data.length || 0) < (proposalsData?.total || 0) ||
            false
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
          {queryBeignFetched.current.category !== FeedCategories.Bounties &&
            (proposalsData?.data || []).map(item => {
              return (
                <ProposalCardRenderer
                  key={item.id}
                  proposalCardNode={
                    <ProposalCard
                      type={item.kind.type}
                      status={item.status}
                      proposer={item.proposer}
                      description={item.description}
                      link={item.link}
                      onVoteClick={() => () => 0}
                      proposalTxHash={item.txHash}
                      expireTime={new Date(
                        Number(item.votePeriodEnd) / 1000000
                      ).toISOString()}
                      accountId={accountId}
                      dao={item.dao}
                      likes={item.voteYes}
                      dislikes={item.voteNo}
                      liked={item.votes[accountId] === 'Yes'}
                      disliked={item.votes[accountId] === 'No'}
                      voteDetails={
                        item.dao.policy.defaultVotePolicy.ratio
                          ? getVoteDetails(
                              item.dao,
                              getScope(item.kind.type),
                              item
                            ).details
                          : undefined
                      }
                      content={null}
                    />
                  }
                  daoFlagNode={
                    <DaoFlagWidget
                      daoName={item.dao.displayName}
                      flagUrl={item.daoDetails.logo}
                      daoId={item.daoId}
                    />
                  }
                  letterHeadNode={
                    <LetterHeadWidget
                      type={item.kind.type}
                      // TODO replace the link with supposed one
                      coverUrl="/cover.png"
                    />
                  }
                  // infoPanelNode={
                  //   <InfoBlockWidget label="Proposer" value={item.proposer} />
                  // }
                  className={styles.itemRoot}
                />
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
