import { useRouter } from 'next/router';
import React, { FC, useCallback, useState } from 'react';

import { Button } from 'components/button/Button';
import styles from 'pages/dao/[dao]/tasks/polls/polls.module.scss';
import {
  FeedCategories,
  Proposal,
  ProposalStatuses,
  ProposalVariant,
} from 'types/proposal';
import { useAuthContext } from 'context/AuthContext';
import { NoResultsView } from 'features/no-results-view';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import NavLink from 'astro_2.0/components/NavLink';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DAO } from 'types/dao';
import { PaginationResponse } from 'types/api';
import { Loader } from 'components/loader';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { SputnikHttpService } from 'services/sputnik/SputnikHttpService';
import { useAsyncFn, useUpdateEffect } from 'react-use';
import StatusFilters from 'astro_2.0/components/Feed/StatusFilters';
import { ProposalsQueries } from 'services/sputnik/types/proposals';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';

export interface PollsPageProps {
  dao: DAO;
  initialPollsData: PaginationResponse<Proposal[]>;
}

const PollsPage: FC<PollsPageProps> = ({ dao, initialPollsData }) => {
  const router = useRouter();
  const { query } = router;
  const daoId = query.dao as string;
  const status = query.status as ProposalStatuses;

  const { accountId } = useAuthContext();
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [pollsData, setPollsData] = useState<PaginationResponse<Proposal[]>>(
    initialPollsData
  );

  const [fetchPollsState, fetchPollsData] = useAsyncFn(
    async (prevState?: PaginationResponse<Proposal[]>) => {
      const response = await SputnikHttpService.getProposalsList({
        daoViewFilter: dao.name,
        offset: prevState?.data.length || 0,
        limit: LIST_LIMIT_DEFAULT,
        category: FeedCategories.Polls,
        status,
        daoFilter: 'All DAOs',
      });

      return {
        ...response,
        data: [...(prevState?.data || []), ...response.data],
      };
    },
    [pollsData.data.length, status, daoId]
  );

  useUpdateEffect(() => {
    fetchPollsData().then(async () => setPollsData(await fetchPollsData()));
  }, [daoId, status, pollsData.data.length]);

  const handleCreateProposal = useCallback(() => {
    setShowCreateProposal(true);
  }, []);

  const loadMore = async () => {
    if (fetchPollsState.loading) {
      return;
    }

    await fetchPollsData(pollsData);
  };

  const onProposalFilterChange = (value?: string) => async () => {
    const nextQuery = {
      ...router.query,
      status: value,
    } as ProposalsQueries;

    if (!value) {
      delete nextQuery.status;
    }

    await router.replace(
      {
        query: nextQuery,
      },
      undefined,
      { shallow: true, scroll: false }
    );
  };

  const isEmptyList = (pollsData.data || []).length === 0;

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/all/daos">All DAOs</NavLink>
        <NavLink href={`/dao/${daoId}`}>{dao?.displayName || dao?.id}</NavLink>
        <span>Polls</span>
      </BreadCrumbs>
      <div className={styles.dao}>
        <DaoDetailsMinimized
          dao={dao}
          accountId={accountId}
          onCreateProposalClick={handleCreateProposal}
        />
        {showCreateProposal && (
          <div className={styles.newProposalWrapper}>
            <CreateProposal
              dao={dao}
              proposalVariant={ProposalVariant.ProposePoll}
              onCreate={isSuccess => {
                if (isSuccess) {
                  setShowCreateProposal(false);
                  fetchPollsData();
                }
              }}
              onClose={() => {
                setShowCreateProposal(false);
              }}
            />
          </div>
        )}
      </div>
      <div className={styles.header}>
        <h1>Polls</h1>
        <Button variant="black" size="small" onClick={handleCreateProposal}>
          Create new poll
        </Button>
      </div>
      <div className={styles.statusFilterWrapper}>
        <StatusFilters
          proposal={status}
          onChange={onProposalFilterChange}
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
          className={styles.statusFilterRoot}
        />
      </div>
      <div className={styles.polls}>
        <InfiniteScroll
          dataLength={pollsData?.data.length || 0}
          next={loadMore}
          hasMore={(pollsData.data.length || 0) < (pollsData.total || 0)}
          loader={<h4 className={styles.loading}>Loading...</h4>}
          style={{ overflow: 'initial' }}
          endMessage={
            !isEmptyList &&
            pollsData.data.length > LIST_LIMIT_DEFAULT && (
              <p className={styles.loading}>
                <b>You have seen it all</b>
              </p>
            )
          }
        >
          {(pollsData?.data || []).map(item => {
            return (
              <div className={styles.proposalCardWrapper}>
                <ViewProposal dao={item.dao} proposal={item} showFlag />
              </div>
            );
          })}

          {isEmptyList && fetchPollsState.loading && <Loader />}

          {isEmptyList && !fetchPollsState.loading && (
            <NoResultsView title="No proposals here" />
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default PollsPage;
