import React, { useMemo } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';

import { DaoContext } from 'types/context';
import { ProposalVariant } from 'types/proposal';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';

import { Page } from 'pages/_app';

import { CreateDraftPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateDraftPageContent';

export type CreateDraftPageProps = {
  daoContext: DaoContext;
};

export const CreateDraftPage: Page<CreateDraftPageProps> = ({ daoContext }) => {
  const { dao } = daoContext;
  const breadcrumbsConfig = useGetBreadcrumbsConfig(dao.id, dao.displayName);
  const { t } = useTranslation();

  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.CREATE_DRAFT_PAGE_URL,
    ];
  }, [breadcrumbsConfig]);

  return (
    <>
      <Head>
        <title>{t('drafts.createDraftPage.headTitle')}</title>
      </Head>
      <NestedDaoPageWrapper
        daoContext={daoContext}
        breadcrumbs={breadcrumbs}
        defaultProposalType={ProposalVariant.ProposePoll}
      >
        <CreateDraftPageContent daoContext={daoContext} />
      </NestedDaoPageWrapper>
    </>
  );
};

export default CreateDraftPage;
