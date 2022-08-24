import React, { FC, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';

import styles from 'pages/dao/[dao]/drafts/[draft]/edit-draft/EditDraftPage.module.scss';

import { BackButton } from 'astro_2.0/features/ViewProposal/components/BackButton';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';

import { DRAFTS_PAGE_URL } from 'constants/routing';
import { getInitialFormValuesFromDraft } from 'astro_2.0/features/ViewProposal/helpers';

import { useDaoCustomTokens } from 'context/DaoTokensContext';
import { useWalletContext } from 'context/WalletContext';

import { DaoContext } from 'types/context';
import { DraftProposal } from 'types/draftProposal';
import { useTranslation } from 'next-i18next';
import { getMockPermissions } from 'features/daos/helpers';

interface Props {
  daoContext: DaoContext;
  draft: DraftProposal;
}

export const EditDraftPageContent: FC<Props> = ({ daoContext, draft }) => {
  const { dao } = daoContext;
  const [initialValues, setInitialValues] = useState({});
  const { tokens } = useDaoCustomTokens();
  const { accountId } = useWalletContext();
  const { t } = useTranslation();
  const draftProposalPermissions = useMemo(() => getMockPermissions(), []);

  useEffect(() => {
    const getInitialValues = async () => {
      if (tokens) {
        const createdInitialValues = await getInitialFormValuesFromDraft(
          draft?.proposalVariant,
          draft as unknown as Record<string, unknown>,
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
    <div className={styles.draftInfo}>
      <BackButton
        name={t('drafts.backToFeed')}
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
          userPermissions={draftProposalPermissions}
          isDraft
          isEditDraft
        />
      ) : null}
    </div>
  );
};
