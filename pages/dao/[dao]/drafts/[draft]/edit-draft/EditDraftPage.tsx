import React, { FC, useMemo } from 'react';
import Head from 'next/head';

import { DaoContext } from 'types/context';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { DraftProposal } from 'types/draftProposal';
import { DraftsDataProvider } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';

import { EditDraftPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/EditDraftPageContent';

export type CreateDraftPageProps = {
  daoContext: DaoContext;
  draft: DraftProposal;
};

export const EditDraftPage: FC<CreateDraftPageProps> = ({
  daoContext,
  draft,
}) => {
  const breadcrumbsConfig = useGetBreadcrumbsConfig(
    daoContext.dao.id,
    daoContext.dao.displayName,
    undefined,
    undefined,
    undefined,
    draft
  );

  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.DRAFTS,
      breadcrumbsConfig.SINGLE_DRAFT_PAGE_URL,
      breadcrumbsConfig.EDIT_DRAFT_PAGE_URL,
    ];
  }, [breadcrumbsConfig]);

  return (
    <>
      <Head>
        <title>Edit Draft</title>
      </Head>
      <NestedDaoPageWrapper daoContext={daoContext} breadcrumbs={breadcrumbs}>
        <DraftsDataProvider>
          <EditDraftPageContent daoContext={daoContext} draft={draft} />
        </DraftsDataProvider>
      </NestedDaoPageWrapper>
    </>
  );
};

export default EditDraftPage;
