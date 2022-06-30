import React, { useMemo } from 'react';
import { NextPage } from 'next';

import { ProposalVariant } from 'types/proposal';
import { DaoContext } from 'types/context';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';
import { DaoPolicyPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent';
import Head from 'next/head';

export interface DaoPolicyPageProps {
  daoContext: DaoContext;
}

const DaoPolicyPage: NextPage<DaoPolicyPageProps> = ({ daoContext }) => {
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
      defaultProposalType={ProposalVariant.ProposeChangeBonds}
    >
      <Head>
        <title>DAO Policy</title>
      </Head>
      <DaoPolicyPageContent daoContext={daoContext} />
    </NestedDaoPageWrapper>
  );
};

export default DaoPolicyPage;
