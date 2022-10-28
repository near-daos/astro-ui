import React, { useMemo } from 'react';
import { NextPage } from 'next';

import { ProposalVariant } from 'types/proposal';
import { DaoContext } from 'types/context';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { DraftsPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent';
import { DraftsDataProvider } from 'astro_2.0/features/Drafts/components/DraftsProvider';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { DraftsFeedNext } from 'astro_3.0/features/DraftsFeedNext/DraftsFeedNext';

export interface DraftsPageProps {
  daoContext: DaoContext;
}

const DraftsPage: NextPage<DraftsPageProps> = ({ daoContext }) => {
  const { useOpenSearchDataApi } = useFlags();
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

  function renderContent() {
    if (useOpenSearchDataApi === undefined) {
      return null;
    }

    return useOpenSearchDataApi ? (
      <DraftsFeedNext daoContext={daoContext} />
    ) : (
      <DraftsPageContent daoContext={daoContext} />
    );
  }

  return (
    <DraftsDataProvider>
      <NestedDaoPageWrapper
        daoContext={daoContext}
        breadcrumbs={breadcrumbs}
        defaultProposalType={ProposalVariant.ProposePoll}
      >
        {renderContent()}
      </NestedDaoPageWrapper>
    </DraftsDataProvider>
  );
};

export default DraftsPage;
