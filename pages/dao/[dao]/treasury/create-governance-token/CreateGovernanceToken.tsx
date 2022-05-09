import React, { useMemo, VFC } from 'react';

import { DaoContext } from 'types/context';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { CreateGovernanceTokenPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent';
import Head from 'next/head';

export interface GovernanceTokenProps {
  daoContext: DaoContext;
}

const CreateGovernanceToken: VFC<GovernanceTokenProps> = props => {
  const {
    daoContext,
    daoContext: { dao },
  } = props;

  const breadcrumbsConfig = useGetBreadcrumbsConfig(dao.id, dao.displayName);

  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.TREASURY,
      breadcrumbsConfig.CREATE_GOVERNANCE_TOKEN,
    ];
  }, [breadcrumbsConfig]);

  return (
    <NestedDaoPageWrapper daoContext={daoContext} breadcrumbs={breadcrumbs}>
      <Head>
        <title>Create governance token</title>
      </Head>
      <CreateGovernanceTokenPageContent daoContext={daoContext} />
    </NestedDaoPageWrapper>
  );
};

export default CreateGovernanceToken;
