import React, { useMemo } from 'react';
import { NextPage } from 'next';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';

import { ProposalVariant } from 'types/proposal';
import { DaoContext } from 'types/context';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { TokensPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/TokensPageContent';
import { TokensPageContentV2 } from 'astro_3.0/features/TokensPageContentV2';
import { useFlags } from 'launchdarkly-react-client-sdk';

export interface TokensPageProps {
  daoContext: DaoContext;
}

const TokensPage: NextPage<TokensPageProps> = ({
  daoContext,
  daoContext: { dao },
}) => {
  const breadcrumbsConfig = useGetBreadcrumbsConfig(dao.id, dao.displayName);
  const { flags } = useFlags();

  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.TREASURY,
    ];
  }, [breadcrumbsConfig]);

  return (
    <NestedDaoPageWrapper
      daoContext={daoContext}
      breadcrumbs={breadcrumbs}
      defaultProposalType={ProposalVariant.ProposeTransfer}
    >
      {flags?.useTransactionsV2Api ? (
        <TokensPageContentV2 daoContext={daoContext} />
      ) : (
        <TokensPageContent daoContext={daoContext} />
      )}
    </NestedDaoPageWrapper>
  );
};

export default TokensPage;
