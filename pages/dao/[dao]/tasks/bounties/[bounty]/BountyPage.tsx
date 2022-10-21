import React, { useMemo } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { DaoContext } from 'types/context';
import { BountyContext, BountyProposal } from 'types/bounties';
import { DAO } from 'types/dao';
import { ProposalFeedItem } from 'types/proposal';

import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';
import { ViewBounty } from 'astro_2.0/features/ViewBounty/ViewBounty';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';

import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';

import styles from './BountyPage.module.scss';

interface BountyPageProps {
  dao: DAO;
  daoContext: DaoContext;
  bountyContext: BountyContext;
  proposal: BountyProposal;
  bountyDoneProposal: ProposalFeedItem;
}

const BountyPage: NextPage<BountyPageProps> = ({
  daoContext,
  bountyContext,
  proposal,
  bountyDoneProposal,
  dao,
}) => {
  const router = useRouter();
  const { bounty, commentsCount } = bountyContext; // prepareBountyObject(bountyContext);

  const breadcrumbsConfig = useGetBreadcrumbsConfig(
    dao.id,
    dao.displayName,
    undefined,
    undefined,
    bountyContext.id
  );
  const breadcrumbs = useMemo(() => {
    return [
      breadcrumbsConfig.ALL_DAOS_URL,
      breadcrumbsConfig.SINGLE_DAO_PAGE,
      breadcrumbsConfig.ALL_BOUNTIES_PAGE_URL,
      breadcrumbsConfig.SINGLE_BOUNTY_PAGE_URL,
    ];
  }, [breadcrumbsConfig]);

  return (
    <>
      <Head>
        <title>Bounty</title>
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
          contextId={bountyContext.id}
          daoId={dao.id}
          bounty={bounty}
          proposal={proposal}
          commentsCount={commentsCount}
          className={styles.bountyInfo}
          initialInfoPanelView="claims"
          showFlag={false}
        />
        {bountyDoneProposal && (
          <ViewProposal proposal={bountyDoneProposal} showFlag={false} />
        )}
      </NestedDaoPageWrapper>
    </>
  );
};

export default BountyPage;
