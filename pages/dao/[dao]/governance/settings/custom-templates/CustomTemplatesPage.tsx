import React, { useMemo } from 'react';
import { NextPage } from 'next';

import { ProposalVariant } from 'types/proposal';
import { DaoContext } from 'types/context';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';
import { CustomFunctionCallTemplatesPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent';
import { DaoFeedItem } from 'types/dao';
import Head from 'next/head';

interface Props {
  daoContext: DaoContext;
  accountDaos: DaoFeedItem[];
}

const CustomTemplatesPage: NextPage<Props> = ({ daoContext, accountDaos }) => {
  const breadcrumbsConfig = useGetBreadcrumbsConfig(
    daoContext.dao.id,
    daoContext.dao.displayName
  );

  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.SETTINGS,
      breadcrumbsConfig.CUSTOM_FC_TEMPLATES,
    ];
  }, [breadcrumbsConfig]);

  return (
    <NestedDaoPageWrapper
      daoContext={daoContext}
      breadcrumbs={breadcrumbs}
      defaultProposalType={ProposalVariant.ProposeChangeDaoName}
    >
      <Head>
        <title>DAO Custom FC Templates</title>
      </Head>
      <CustomFunctionCallTemplatesPageContent
        daoContext={daoContext}
        accountDaos={accountDaos}
      />
    </NestedDaoPageWrapper>
  );
};

export default CustomTemplatesPage;
