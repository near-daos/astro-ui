import React, { ReactNode, useMemo } from 'react';
import Head from 'next/head';

import { DaoContext } from 'types/context';
import { ProposalVariant } from 'types/proposal';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { BackButton } from 'astro_2.0/features/ViewProposal/components/BackButton';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';
import { DraftsDataProvider } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';

import { DRAFTS_PAGE_URL } from 'constants/routing';

import { getAppVersion } from 'hooks/useAppVersion';
import { MainLayout } from 'astro_3.0/features/MainLayout';
import { Page } from 'pages/_app';

import styles from './CreateDraftPage.module.scss';

export type CreateDraftPageProps = {
  daoContext: DaoContext;
};

export const CreateDraftPage: Page<CreateDraftPageProps> = ({ daoContext }) => {
  const { dao } = daoContext;
  const { tokens } = useDaoCustomTokens();
  const breadcrumbsConfig = useGetBreadcrumbsConfig(dao.id, dao.displayName);

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
        <title>Create Draft</title>
      </Head>
      <NestedDaoPageWrapper
        daoContext={daoContext}
        breadcrumbs={breadcrumbs}
        defaultProposalType={ProposalVariant.ProposePoll}
      >
        <>
          <BackButton
            name="Back to Draft Feed"
            href={{
              pathname: DRAFTS_PAGE_URL,
              query: {
                dao: dao.id,
              },
            }}
          />

          <h1 className={styles.title}>Creating draft</h1>
          <DraftsDataProvider>
            <CreateProposal
              isDraft
              showInfo={false}
              showClose={false}
              showFlag={false}
              dao={dao}
              daoTokens={tokens}
              onClose={() => undefined}
              userPermissions={daoContext.userPermissions}
            />
          </DraftsDataProvider>
        </>
      </NestedDaoPageWrapper>
    </>
  );
};

CreateDraftPage.getLayout = function getLayout(page: ReactNode) {
  const appVersion = getAppVersion();

  if (appVersion === 3) {
    return (
      <>
        <MainLayout>{page}</MainLayout>
      </>
    );
  }

  return page;
};

export default CreateDraftPage;
