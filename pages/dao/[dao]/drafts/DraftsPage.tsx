import React, { useMemo } from 'react';
import { NextPage } from 'next';

import { ProposalVariant } from 'types/proposal';
import { DaoContext } from 'types/context';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';
import Head from 'next/head';
import { DraftsPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent';
import { DraftsDataProvider } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';

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
    <NestedDaoPageWrapper
      daoContext={daoContext}
      breadcrumbs={breadcrumbs}
      defaultProposalType={ProposalVariant.ProposePoll}
    >
      <Head>
        <title>Drafts</title>
      </Head>
      <DraftsDataProvider>
        <DraftsPageContent daoContext={daoContext} />
      </DraftsDataProvider>
    </NestedDaoPageWrapper>
  );
};

export default DraftsPage;
