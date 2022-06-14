import React, { FC, useMemo } from 'react';
import Head from 'next/head';

import { DaoContext } from 'types/context';
import { ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { BackButton } from 'astro_2.0/features/ViewProposal/components/BackButton';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';

import { DRAFTS_PAGE_URL } from 'constants/routing';

import styles from './CreateDraftPage.module.scss';

export type CreateDraftPageProps = {
  daoContext: DaoContext;
  dao: DAO;
};

export const CreateDraftPage: FC<CreateDraftPageProps> = ({
  daoContext,
  dao,
}) => {
  const { tokens } = useDaoCustomTokens();
  const breadcrumbsConfig = useGetBreadcrumbsConfig(
    daoContext.dao.id,
    daoContext.dao.displayName
  );

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
        </>
      </NestedDaoPageWrapper>
    </>
  );
};

export default CreateDraftPage;
