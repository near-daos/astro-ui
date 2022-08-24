import React, { FC, useMemo } from 'react';
import { BackButton } from 'astro_2.0/features/ViewProposal/components/BackButton';
import { DRAFTS_PAGE_URL } from 'constants/routing';
import styles from 'pages/dao/[dao]/create-draft/CreateDraftPage.module.scss';
import { DraftsDataProvider } from 'astro_2.0/features/Drafts/components/DraftsProvider';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';
import { DaoContext } from 'types/context';
import { useDaoCustomTokens } from 'context/DaoTokensContext';
import { getMockPermissions } from 'features/daos/helpers';
import { useTranslation } from 'next-i18next';
import { useCreateDraftPermissions } from 'hooks/useCreateDraftPermissions';

interface Props {
  daoContext: DaoContext;
}

export const CreateDraftPageContent: FC<Props> = ({ daoContext }) => {
  const { dao } = daoContext;
  const { t } = useTranslation();
  const { tokens } = useDaoCustomTokens();

  const draftProposalPermissions = useMemo(() => getMockPermissions(), []);

  const { canCreateDrafts } = useCreateDraftPermissions(dao);

  if (!canCreateDrafts) {
    return null;
  }

  return (
    <>
      <BackButton
        name={t('drafts.backToFeed')}
        href={{
          pathname: DRAFTS_PAGE_URL,
          query: {
            dao: dao.id,
          },
        }}
      />

      <h1 className={styles.title}>{t('drafts.createDraftPage.title')}</h1>
      <DraftsDataProvider>
        <CreateProposal
          isDraft
          showInfo={false}
          showClose={false}
          showFlag={false}
          dao={dao}
          daoTokens={tokens}
          onClose={() => undefined}
          userPermissions={draftProposalPermissions}
        />
      </DraftsDataProvider>
    </>
  );
};
