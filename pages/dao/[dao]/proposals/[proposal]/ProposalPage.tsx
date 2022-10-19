import { NextPage } from 'next';
import React, { useMemo } from 'react';
import { SWRConfig } from 'swr';

import { DAO } from 'types/dao';
import { DaoContext } from 'types/context';
import { ProposalFeedItem } from 'types/proposal';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { MemberStats } from 'services/sputnik/mappers';

import { ProposalPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/ProposalPageContent';

interface ProposalPageProps {
  dao: DAO;
  availableGroups: string[];
  membersStats: MemberStats[];
  daoContext: DaoContext;
  fallback: { [p: string]: ProposalFeedItem } | undefined;
}

const ProposalPage: NextPage<ProposalPageProps> = ({
  dao,
  membersStats,
  daoContext,
  fallback,
}) => {
  const breadcrumbsConfig = useGetBreadcrumbsConfig(dao.id, dao.displayName);
  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.ALL_PROPOSALS_PAGE_URL,
    ];
  }, [breadcrumbsConfig]);

  return (
    <SWRConfig value={{ fallback }}>
      <NestedDaoPageWrapper daoContext={daoContext} breadcrumbs={breadcrumbs}>
        <ProposalPageContent
          daoContext={daoContext}
          membersStats={membersStats}
        />
      </NestedDaoPageWrapper>
    </SWRConfig>
  );
};

export default ProposalPage;
