import React, { VFC, useMemo } from 'react';

import { BountyContext } from 'types/bounties';
import { ProposalVariant } from 'types/proposal';

import { DaoContext } from 'types/context';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { BountiesPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/BountiesPageContent';
import { BountiesFeed } from 'astro_2.0/features/Bounties/components/BountiesFeed';
import { PaginationResponse } from 'types/api';

export interface BountiesFeedPageProps {
  daoContext: DaoContext;
  bountiesContext: PaginationResponse<BountyContext[]> | null;
}

const BountiesFeedPage: VFC<BountiesFeedPageProps> = ({
  daoContext,
  bountiesContext,
}) => {
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

  return (
    <NestedDaoPageWrapper
      daoContext={daoContext}
      breadcrumbs={breadcrumbs}
      defaultProposalType={ProposalVariant.ProposeCreateBounty}
    >
      <BountiesPageContent daoContext={daoContext}>
        <BountiesFeed initialData={bountiesContext} />
      </BountiesPageContent>
    </NestedDaoPageWrapper>
  );
};

export default BountiesFeedPage;
