import React, { FC, useMemo } from 'react';
import Head from 'next/head';

// Types
import { PaginationResponse } from 'types/api';
import {
  ProposalVariant,
  ProposalCategories,
  ProposalFeedItem,
  ProposalsFeedStatuses,
} from 'types/proposal';

// Components
import { Feed } from 'astro_2.0/features/Feed';
import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';

// Hooks
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { DaoContext } from 'types/context';
import styles from './Polls.module.scss';

export interface PollsPageProps {
  daoContext: DaoContext;
  initialPollsData: PaginationResponse<ProposalFeedItem[]> | null;
  initialProposalsStatusFilterValue: ProposalsFeedStatuses;
}

const PollsPage: FC<PollsPageProps> = ({
  daoContext,
  initialPollsData,
  initialProposalsStatusFilterValue,
}) => {
  const breadcrumbsConfig = useGetBreadcrumbsConfig(
    daoContext.dao.id,
    daoContext.dao.displayName
  );

  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.POLLS,
    ];
  }, [breadcrumbsConfig]);

  return (
    <NestedDaoPageWrapper
      daoContext={daoContext}
      breadcrumbs={breadcrumbs}
      defaultProposalType={ProposalVariant.ProposePoll}
    >
      <Head>
        <title>Polls</title>
      </Head>
      <Feed
        title="Polls"
        dao={daoContext.dao}
        showFlag={false}
        className={styles.feed}
        category={ProposalCategories.Polls}
        initialProposals={initialPollsData}
        headerClassName={styles.feedHeader}
        initialProposalsStatusFilterValue={initialProposalsStatusFilterValue}
      />
    </NestedDaoPageWrapper>
  );
};

export default PollsPage;
