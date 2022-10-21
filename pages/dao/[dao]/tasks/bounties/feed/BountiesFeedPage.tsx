import React, { VFC, useMemo } from 'react';
import Head from 'next/head';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { BountyContext } from 'types/bounties';
import { ProposalVariant } from 'types/proposal';
import { PaginationResponse } from 'types/api';
import { DaoContext } from 'types/context';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { BountiesPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/BountiesPageContent';
import { BountiesFeed } from 'astro_2.0/features/Bounties/components/BountiesFeed';
import { DaoBounties } from 'astro_3.0/features/Bounties/components/DaoBounties';

export interface BountiesFeedPageProps {
  daoContext: DaoContext;
  bountiesContext: PaginationResponse<BountyContext[]> | null;
}

const BountiesFeedPage: VFC<BountiesFeedPageProps> = ({
  daoContext,
  bountiesContext,
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
      breadcrumbsConfig.BOUNTIES,
    ];
  }, [breadcrumbsConfig]);

  function renderContent() {
    if (useOpenSearchDataApi === undefined) {
      return null;
    }

    return useOpenSearchDataApi ? (
      <BountiesPageContent daoContext={daoContext} hideFilters>
        <DaoBounties dao={daoContext.dao} />
      </BountiesPageContent>
    ) : (
      <BountiesPageContent daoContext={daoContext}>
        <BountiesFeed initialData={bountiesContext} />
      </BountiesPageContent>
    );
  }

  return (
    <NestedDaoPageWrapper
      daoContext={daoContext}
      breadcrumbs={breadcrumbs}
      defaultProposalType={ProposalVariant.ProposeCreateBounty}
    >
      <Head>
        <title>Bounties feed</title>
      </Head>
      {renderContent()}
    </NestedDaoPageWrapper>
  );
};

export default BountiesFeedPage;
