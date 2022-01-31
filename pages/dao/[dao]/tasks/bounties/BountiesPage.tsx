import React, { VFC, useMemo } from 'react';

import { Bounty } from 'types/bounties';
import { ProposalFeedItem, ProposalVariant } from 'types/proposal';

import { DaoContext } from 'types/context';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { BountiesPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/BountiesPageContent';

export interface BountiesPageProps {
  daoContext: DaoContext;
  initialBounties: Bounty[];
  bountyDoneProposals: ProposalFeedItem[];
}

const BountiesPage: VFC<BountiesPageProps> = ({
  daoContext,
  daoContext: { dao },
  initialBounties,
  bountyDoneProposals,
}) => {
  const breadcrumbsConfig = useGetBreadcrumbsConfig(dao.id, dao.displayName);

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
        initialBounties={initialBounties}
        bountyDoneProposals={bountyDoneProposals}
      />
    </NestedDaoPageWrapper>
  );
};

export default BountiesPage;
