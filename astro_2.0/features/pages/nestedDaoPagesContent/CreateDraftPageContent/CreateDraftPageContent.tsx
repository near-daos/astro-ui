import React, { FC, useMemo } from 'react';
import { BackButton } from 'astro_2.0/features/ViewProposal/components/BackButton';
import { DRAFTS_PAGE_URL } from 'constants/routing';
import styles from 'pages/dao/[dao]/create-draft/CreateDraftPage.module.scss';
import { DraftsDataProvider } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';
import { DaoContext } from 'types/context';
import { useDaoCustomTokens } from 'context/DaoTokensContext';
import { getMockPermissions } from 'features/daos/helpers';

interface Props {
  daoContext: DaoContext;
}

export const CreateDraftPageContent: FC<Props> = ({ daoContext }) => {
  const { dao } = daoContext;

  const { tokens } = useDaoCustomTokens();

  const draftProposalPermissions = useMemo(() => getMockPermissions(), []);

  return (
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
          userPermissions={draftProposalPermissions}
        />
      </DraftsDataProvider>
    </>
  );
};
