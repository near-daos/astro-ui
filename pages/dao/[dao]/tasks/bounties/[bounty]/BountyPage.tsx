import React, { useMemo } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { DaoContext } from 'types/context';
import { BountyContext } from 'types/bounties';
import { DAO } from 'types/dao';
import { Proposal } from 'types/proposal';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { ViewBounty } from 'astro_2.0/features/ViewBounty/ViewBounty';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';

import styles from './BountyPage.module.scss';

interface BountyPageProps {
  dao: DAO;
  daoContext: DaoContext;
  bountyContext: BountyContext;
  proposal: Proposal;
}

const BountyPage: NextPage<BountyPageProps> = ({
  daoContext,
  bountyContext,
  proposal,
  dao,
}) => {
  const router = useRouter();
  const { tokens } = useDaoCustomTokens();
  const { bounty } = bountyContext;

  const breadcrumbsConfig = useGetBreadcrumbsConfig(
    dao,
    undefined,
    undefined,
    bounty
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
    <div className={styles.root}>
      <Head>
        <title>Astro</title>
        <meta property="og:url" content={router.asPath} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Astro" />
        <meta property="og:description" content={bounty?.description} />
        <meta property="og:image" content={dao?.flagCover || dao?.logo} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={router.asPath} />
        <meta name="twitter:title" content="Astro" />
        <meta name="twitter:description" content={bounty?.description} />
        <meta name="twitter:image" content={dao?.flagCover || dao?.logo} />
      </Head>
      <NestedDaoPageWrapper daoContext={daoContext} breadcrumbs={breadcrumbs}>
        <ViewBounty
          dao={dao}
          bounty={bounty}
          proposal={proposal}
          tokens={tokens}
          className={styles.bountyInfo}
        />
      </NestedDaoPageWrapper>
    </div>
  );
};

export default BountyPage;
