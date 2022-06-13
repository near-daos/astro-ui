import React, { FC, useMemo } from 'react';
import Head from 'next/head';

import { DaoContext } from 'types/context';
import { DAO } from 'types/dao';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { BackButton } from 'astro_2.0/features/ViewProposal/components/BackButton';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { DraftProposal } from 'types/draftProposal';

import { DRAFTS_PAGE_URL } from 'constants/routing';

import styles from './EditDraftPage.module.scss';

export type CreateDraftPageProps = {
  daoContext: DaoContext;
  dao: DAO;
  draft: DraftProposal;
};

export const EditDraftPage: FC<CreateDraftPageProps> = ({
  daoContext,
  dao,
  draft,
}) => {
  const { tokens } = useDaoCustomTokens();
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
        <>
          <div className={styles.draftInfo}>
            <BackButton
              name="Back to Draft Feed"
              href={{
                pathname: DRAFTS_PAGE_URL,
                query: {
                  dao: dao.id,
                },
              }}
            />
            <ViewProposal
              preventNavigate
              isDraft
              isEditDraft
              proposal={draft}
              showFlag={false}
              tokens={tokens}
            />
          </div>
        </>
      </NestedDaoPageWrapper>
    </>
  );
};

export default EditDraftPage;
