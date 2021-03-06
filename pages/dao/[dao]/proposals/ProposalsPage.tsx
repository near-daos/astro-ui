import React, { useMemo, VFC } from 'react';
import { useTranslation } from 'next-i18next';

import { ProposalFeedItem, ProposalsFeedStatuses } from 'types/proposal';
import { DaoContext } from 'types/context';
import { PaginationResponse } from 'types/api';

import { FeedProposals } from 'astro_2.0/features/FeedProposals';
import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';
import { useBlockchainWarning } from 'hooks/useBlockchainWarning';
import Head from 'next/head';

interface ProposalsPageProps {
  daoContext: DaoContext;
  initialProposalsData: PaginationResponse<ProposalFeedItem[]>;
  initialProposalsStatusFilterValue: ProposalsFeedStatuses;
}

const ProposalsPage: VFC<ProposalsPageProps> = props => {
  const {
    daoContext,
    daoContext: { dao },
    initialProposalsData,
    initialProposalsStatusFilterValue,
  } = props;

  const { t } = useTranslation();
  const breadcrumbsConfig = useGetBreadcrumbsConfig(dao.id, dao.displayName);

  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.ALL_PROPOSALS_PAGE_URL,
    ];
  }, [breadcrumbsConfig]);

  useBlockchainWarning();

  return (
    <NestedDaoPageWrapper daoContext={daoContext} breadcrumbs={breadcrumbs}>
      <Head>
        <title>DAO Proposals</title>
      </Head>
      <FeedProposals
        dao={dao}
        key={dao.id}
        showFlag={false}
        title={t('proposals')}
        initialProposals={initialProposalsData}
        initialProposalsStatusFilterValue={initialProposalsStatusFilterValue}
      />
    </NestedDaoPageWrapper>
  );
};

export default ProposalsPage;
