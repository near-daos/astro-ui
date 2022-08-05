import Head from 'next/head';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import { DAO } from 'types/dao';
import { ProposalFeedItem } from 'types/proposal';
import { DaoContext } from 'types/context';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import { MemberStats } from 'services/sputnik/mappers';

import { ProposalPageContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/ProposalPageContent';

interface ProposalPageProps {
  dao: DAO;
  proposal: ProposalFeedItem;
  availableGroups: string[];
  membersStats: MemberStats[];
  daoContext: DaoContext;
}

const ProposalPage: NextPage<ProposalPageProps> = ({
  dao,
  proposal,
  membersStats,
  daoContext,
}) => {
  const router = useRouter();

  const breadcrumbsConfig = useGetBreadcrumbsConfig(
    dao.id,
    dao.displayName,
    undefined,
    proposal
  );
  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.ALL_PROPOSALS_PAGE_URL,
      breadcrumbsConfig.SINGLE_PROPOSAL_PAGE_URL,
    ];
  }, [breadcrumbsConfig]);

  return (
    <>
      <Head>
        <title>DAO Proposal</title>
        <meta property="og:url" content={router.asPath} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Astro" />
        <meta property="og:description" content={proposal?.description} />
        <meta property="og:image" content={dao?.flagCover || dao?.logo} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={router.asPath} />
        <meta name="twitter:title" content="Astro" />
        <meta name="twitter:description" content={proposal?.description} />
        <meta name="twitter:image" content={dao?.flagCover || dao?.logo} />
      </Head>
      <NestedDaoPageWrapper daoContext={daoContext} breadcrumbs={breadcrumbs}>
        <ProposalPageContent
          daoContext={daoContext}
          proposal={proposal}
          membersStats={membersStats}
        />
      </NestedDaoPageWrapper>
    </>
  );
};

export default ProposalPage;
