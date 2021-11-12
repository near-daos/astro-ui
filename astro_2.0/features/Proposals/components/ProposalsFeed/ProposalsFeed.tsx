import React, { useCallback, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import cn from 'classnames';

import Feed from 'astro_2.0/features/Feed';
import { NoResultsView } from 'features/no-results-view';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { ProposalCategoryFilter } from 'astro_2.0/features/Proposals/components/ProposalCategoryFilter';
import { ProposalStatusFilter } from 'astro_2.0/features/Proposals/components/ProposalStatusFilter';

import { DAO } from 'types/dao';
import { PaginationResponse } from 'types/api';
import { Proposal, ProposalCategories, ProposalStatuses } from 'types/proposal';

import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { SputnikHttpService } from 'services/sputnik/SputnikHttpService';

import useQuery from 'hooks/useQuery';
import styles from './ProposalsFeed.module.scss';

type ProposalsFeedProps = {
  className?: string;
  dao: DAO;
  title?: string;
  status?: ProposalStatuses;
  category?: ProposalCategories;
  showFlag?: boolean;
  initialProposalsData: PaginationResponse<Proposal[]>;
};

type ProposalsFeedFilters = {
  proposalStatus: ProposalStatuses;
  proposalCategory: ProposalCategories;
};

export const ProposalsFeed: React.FC<ProposalsFeedProps> = ({
  className,
  dao,
  title,
  status,
  category,
  showFlag = false,
  initialProposalsData,
}) => {
  const [proposalsData, setProposalsData] = useState(initialProposalsData);
  const { query: filter } = useQuery<ProposalsFeedFilters>();

  const fetchData = useCallback(
    async (offset: number) => {
      return SputnikHttpService.getProposalsList({
        offset,
        limit: LIST_LIMIT_DEFAULT,
        daoId: dao.id,
        category: category || filter.proposalCategory,
        status: status || filter.proposalStatus,
      });
    },
    [dao.id, category, filter.proposalCategory, filter.proposalStatus, status]
  );

  const { query, updateQuery } = useQuery<{
    proposalStatus: ProposalStatuses;
  }>();

  const handleLoadMore = useCallback(async () => {
    const response = await fetchData(proposalsData.data.length);

    setProposalsData(prevProposalsData => ({
      ...response,
      data: [...prevProposalsData.data, ...response.data],
    }));
  }, [fetchData, proposalsData.data.length]);

  useUpdateEffect(() => {
    fetchData(0).then(setProposalsData);
  }, [fetchData]);

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.feedHeader}>
        {title && <h1 className={styles.title}>{title}</h1>}

        <ProposalStatusFilter
          value={query.proposalStatus}
          onChange={value => {
            updateQuery('proposalStatus', value as ProposalStatuses);
          }}
          list={[
            {
              value: '',
              label: 'All',
            },
            {
              value: ProposalStatuses.Active,
              label: 'Active',
            },
            {
              value: ProposalStatuses.Approved,
              label: 'Approved',
            },
            {
              value: ProposalStatuses.Failed,
              label: 'Failed',
            },
          ]}
        />
      </div>

      <div className={styles.container}>
        {!category && (
          <ProposalCategoryFilter
            className={styles.categoryFilter}
            query={query}
            queryName="proposalCategory"
          />
        )}
        <Feed
          className={styles.feed}
          data={proposalsData}
          loadMore={handleLoadMore}
          loader={<p className={styles.loading}>Loading...</p>}
          noResults={
            <div className={styles.loading}>
              <NoResultsView title="No more results" />
            </div>
          }
          renderItem={proposal => (
            <div key={proposal.id} className={styles.proposalCardWrapper}>
              <ViewProposal dao={dao} proposal={proposal} showFlag={showFlag} />
            </div>
          )}
        />
      </div>
    </div>
  );
};
