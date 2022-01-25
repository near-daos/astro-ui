import React, { VFC, useMemo } from 'react';

import { BountyContext } from 'types/bounties';
import { ProposalVariant } from 'types/proposal';

import { DaoContext } from 'types/context';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { BountiesPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/BountiesPageContent';

export interface BountiesPageProps {
  daoContext: DaoContext;
  bountiesContext: BountyContext[];
}

const BountiesPage: VFC<BountiesPageProps> = ({
  daoContext,
  bountiesContext,
}) => {
  const breadcrumbsConfig = useGetBreadcrumbsConfig(daoContext.dao);

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
      <BountiesPageContent
        daoContext={daoContext}
        bountiesContext={bountiesContext}
      />
    </NestedDaoPageWrapper>
  );
};

export default BountiesPage;
