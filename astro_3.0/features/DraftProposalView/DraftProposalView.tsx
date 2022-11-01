import React, { FC, useMemo } from 'react';
import { useTranslation } from 'next-i18next';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { DraftWrapper } from 'astro_2.0/features/Drafts/components/DraftWrapper';
import { BackButton } from 'astro_2.0/features/ViewProposal/components/BackButton';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { DraftComments } from 'astro_2.0/features/DraftComments';
import { DraftsDataProvider } from 'astro_2.0/features/Drafts/components/DraftsProvider';
import { Loader } from 'components/loader';

import { DaoContext } from 'types/context';

import { DRAFTS_PAGE_URL } from 'constants/routing';
import { useDraft } from 'services/ApiService/hooks/useDraft';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import styles from 'pages/dao/[dao]/drafts/[draft]/Draft.module.scss';

interface Props {
  daoContext: DaoContext;
}

export const DraftProposalView: FC<Props> = ({ daoContext }) => {
  const { data: draft, isLoading } = useDraft();
  const { t } = useTranslation();
  const { dao } = daoContext;

  const breadcrumbsConfig = useGetBreadcrumbsConfig(
    dao.id,
    dao.displayName,
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
    ];
  }, [breadcrumbsConfig]);

  return (
    <DraftsDataProvider>
      <NestedDaoPageWrapper daoContext={daoContext} breadcrumbs={breadcrumbs}>
        <DraftWrapper>
          {toggleCreateProposal => (
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

              {isLoading && <Loader />}

              {draft && (
                <ViewProposal
                  preventNavigate
                  isDraft
                  dao={dao}
                  proposal={draft}
                  showFlag={false}
                  userPermissions={daoContext.userPermissions}
                  toggleCreateProposal={toggleCreateProposal}
                />
              )}

              <DraftComments dao={dao} />
            </div>
          )}
        </DraftWrapper>
      </NestedDaoPageWrapper>
    </DraftsDataProvider>
  );
};
