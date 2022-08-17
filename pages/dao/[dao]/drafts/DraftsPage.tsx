import React, { useMemo } from 'react';
import { NextPage } from 'next';

import { ProposalVariant } from 'types/proposal';
import { DaoContext } from 'types/context';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { DraftsPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent';
import { DraftsDataProvider } from 'astro_2.0/features/Drafts/components/DraftsProvider';

export interface DraftsPageProps {
  daoContext: DaoContext;
}

const DraftsPage: NextPage<DraftsPageProps> = ({ daoContext }) => {
  const breadcrumbsConfig = useGetBreadcrumbsConfig(
    daoContext.dao.id,
    daoContext.dao.displayName
  );

  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.DRAFTS,
    ];
  }, [breadcrumbsConfig]);

  return (
    <DraftsDataProvider>
      <NestedDaoPageWrapper
        daoContext={daoContext}
        breadcrumbs={breadcrumbs}
        defaultProposalType={ProposalVariant.ProposePoll}
      >
        <DraftsPageContent daoContext={daoContext} />
      </NestedDaoPageWrapper>
    </DraftsDataProvider>
  );
};

export default DraftsPage;
