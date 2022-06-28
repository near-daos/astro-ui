import React, { useMemo } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

import { ProposalVariant } from 'types/proposal';
import { DaoContext } from 'types/context';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';
import { DelegatePageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent';

interface Props {
  daoContext: DaoContext;
}

const DelegatePage: NextPage<Props> = ({ daoContext }) => {
  const breadcrumbsConfig = useGetBreadcrumbsConfig(
    daoContext.dao.id,
    daoContext.dao.displayName
  );

  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.DELEGATE,
    ];
  }, [breadcrumbsConfig]);

  return (
    <NestedDaoPageWrapper
      daoContext={daoContext}
      breadcrumbs={breadcrumbs}
      defaultProposalType={ProposalVariant.ProposePoll}
    >
      <Head>
        <title>Stake and Delegate</title>
      </Head>
      <DelegatePageContent daoContext={daoContext} />
    </NestedDaoPageWrapper>
  );
};

export default DelegatePage;
