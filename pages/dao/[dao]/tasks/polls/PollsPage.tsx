import React, { FC, useMemo } from 'react';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import { useFlags } from 'launchdarkly-react-client-sdk';

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

import { PollsProposalsFeed } from 'astro_3.0/features/PollsProposalsFeed';

import styles from './Polls.module.scss';

export interface PollsPageProps {
  daoContext: DaoContext;
  initialPollsData: PaginationResponse<ProposalFeedItem[]> | null;
  initialProposalsStatusFilterValue: ProposalsFeedStatuses;
  fallback:
    | { [p: string]: PaginationResponse<ProposalFeedItem[]> | null }
    | undefined;
}

const PollsPage: FC<PollsPageProps> = ({
  daoContext,
  initialPollsData,
  initialProposalsStatusFilterValue,
  fallback,
}) => {
  const { useOpenSearchDataApi } = useFlags();

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
    <SWRConfig value={{ fallback }}>
      <NestedDaoPageWrapper
        daoContext={daoContext}
        breadcrumbs={breadcrumbs}
        defaultProposalType={ProposalVariant.ProposePoll}
      >
        <Head>
          <title>Polls</title>
        </Head>
        {useOpenSearchDataApi ? (
          <PollsProposalsFeed />
        ) : (
          <Feed
            title="Polls"
            dao={daoContext.dao}
            showFlag={false}
            className={styles.feed}
            category={ProposalCategories.Polls}
            initialProposals={initialPollsData}
            headerClassName={styles.feedHeader}
            initialProposalsStatusFilterValue={
              initialProposalsStatusFilterValue
            }
          />
        )}
      </NestedDaoPageWrapper>
    </SWRConfig>
  );
};

export default PollsPage;
