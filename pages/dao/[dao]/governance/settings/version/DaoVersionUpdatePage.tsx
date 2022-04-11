import React, { useMemo } from 'react';
import { NextPage } from 'next';

import { ProposalVariant } from 'types/proposal';
import { DaoContext } from 'types/context';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';
import { DaoVersionPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoVersionPageContent';

export interface DaoVersionUpdatePageProps {
  daoContext: DaoContext;
}

const DaoVersionUpdatePage: NextPage<DaoVersionUpdatePageProps> = ({
  daoContext,
}) => {
  const breadcrumbsConfig = useGetBreadcrumbsConfig(
    daoContext.dao.id,
    daoContext.dao.displayName
  );

  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.SETTINGS,
      breadcrumbsConfig.DAO_CONFIG,
    ];
  }, [breadcrumbsConfig]);

  return (
    <NestedDaoPageWrapper
      daoContext={daoContext}
      breadcrumbs={breadcrumbs}
      defaultProposalType={ProposalVariant.ProposeChangeVotingPolicy}
    >
      <DaoVersionPageContent daoContext={daoContext} />
    </NestedDaoPageWrapper>
  );
};

export default DaoVersionUpdatePage;
