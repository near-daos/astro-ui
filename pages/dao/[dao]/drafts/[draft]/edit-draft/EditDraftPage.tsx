import React, { FC, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import isEmpty from 'lodash/isEmpty';

import { DaoContext } from 'types/context';
import { DAO } from 'types/dao';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { BackButton } from 'astro_2.0/features/ViewProposal/components/BackButton';
import { DraftProposal } from 'types/draftProposal';
import { DraftsDataProvider } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';
import { getInitialFormValuesFromDraft } from 'astro_2.0/features/ViewProposal/helpers';
import { useWalletContext } from 'context/WalletContext';

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
  const [initialValues, setInitialValues] = useState({});
  const { tokens } = useDaoCustomTokens();
  const { accountId } = useWalletContext();
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

  useEffect(() => {
    const getInitialValues = async () => {
      if (tokens) {
        const createdInitialValues = await getInitialFormValuesFromDraft(
          draft?.proposalVariant,
          (draft as unknown) as Record<string, unknown>,
          tokens,
          accountId || ''
        );

        setInitialValues({
          ...createdInitialValues,
          id: draft.id,
          state: draft.state,
          externalUrl: '',
          title: draft.title,
          description: draft.description,
          details: draft.description,
        });
      }
    };

    getInitialValues();
  }, [accountId, draft, tokens]);

  return (
    <>
      <Head>
        <title>Edit Draft</title>
      </Head>
      <NestedDaoPageWrapper daoContext={daoContext} breadcrumbs={breadcrumbs}>
        <DraftsDataProvider>
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
            {!isEmpty(initialValues) ? (
              <CreateProposal
                proposalVariant={draft.proposalVariant}
                showInfo={false}
                showClose={false}
                showFlag={false}
                dao={dao}
                daoTokens={tokens}
                onClose={() => undefined}
                initialValues={initialValues}
                userPermissions={daoContext.userPermissions}
                isDraft
                isEditDraft
              />
            ) : null}
          </div>
        </DraftsDataProvider>
      </NestedDaoPageWrapper>
    </>
  );
};

export default EditDraftPage;
