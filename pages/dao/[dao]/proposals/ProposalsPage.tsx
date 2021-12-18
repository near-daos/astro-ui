import React, { useMemo, VFC } from 'react';
import { useTranslation } from 'next-i18next';

import { Proposal } from 'types/proposal';
import { DaoContext } from 'types/context';
import { PaginationResponse } from 'types/api';

import { Feed } from 'astro_2.0/features/Feed';
import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

interface ProposalsPageProps {
  daoContext: DaoContext;
  initialProposalsData: PaginationResponse<Proposal[]>;
}

const ProposalsPage: VFC<ProposalsPageProps> = props => {
  const {
    daoContext,
    daoContext: { dao },
    initialProposalsData,
  } = props;

  const { t } = useTranslation();
  const breadcrumbsConfig = useGetBreadcrumbsConfig(dao);

  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.ALL_PROPOSALS_PAGE_URL,
    ];
  }, [breadcrumbsConfig]);

  return (
    <NestedDaoPageWrapper daoContext={daoContext} breadcrumbs={breadcrumbs}>
      <Feed
        dao={dao}
        key={dao.id}
        showFlag={false}
        title={t('proposals')}
        initialProposals={initialProposalsData}
      />
    </NestedDaoPageWrapper>
  );
};

export default ProposalsPage;
