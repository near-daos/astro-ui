import React, { useMemo } from 'react';
import { NextPage } from 'next';

import { ProposalVariant } from 'types/proposal';
import { DaoContext } from 'types/context';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';
import { SettingsPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/SettingsPageContent';
import Head from 'next/head';

export interface SettingsPageProps {
  daoContext: DaoContext;
}

const SettingsPage: NextPage<SettingsPageProps> = ({ daoContext }) => {
  const breadcrumbsConfig = useGetBreadcrumbsConfig(
    daoContext.dao.id,
    daoContext.dao.displayName
  );

  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.SETTINGS,
    ];
  }, [breadcrumbsConfig]);

  return (
    <NestedDaoPageWrapper
      daoContext={daoContext}
      breadcrumbs={breadcrumbs}
      defaultProposalType={ProposalVariant.ProposeChangeDaoName}
    >
      <Head>
        <title>DAO Settings</title>
      </Head>
      <SettingsPageContent daoContext={daoContext} />
    </NestedDaoPageWrapper>
  );
};

export default SettingsPage;
