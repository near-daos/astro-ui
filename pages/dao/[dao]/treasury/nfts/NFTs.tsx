import React, { useMemo } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

import { ProposalVariant } from 'types/proposal';

import { DaoContext } from 'types/context';
import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { NFTsPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/NFTsPageContent';

export interface NFTsPageProps {
  daoContext: DaoContext;
}

const NFTs: NextPage<NFTsPageProps> = ({ daoContext }) => {
  const breadcrumbsConfig = useGetBreadcrumbsConfig(
    daoContext.dao.id,
    daoContext.dao.displayName
  );

  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.NFTS,
    ];
  }, [breadcrumbsConfig]);

  return (
    <NestedDaoPageWrapper
      daoContext={daoContext}
      breadcrumbs={breadcrumbs}
      defaultProposalType={ProposalVariant.ProposeCustomFunctionCall}
    >
      <Head>
        <title>NFTs</title>
      </Head>
      <NFTsPageContent daoContext={daoContext} />
    </NestedDaoPageWrapper>
  );
};

export default NFTs;
