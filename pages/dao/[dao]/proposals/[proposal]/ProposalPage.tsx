import Head from 'next/head';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { useTranslation } from 'next-i18next';

import { DAO } from 'types/dao';
import { ProposalFeedItem } from 'types/proposal';
import { DaoContext } from 'types/context';

import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';

import { VoteCollapsableList } from 'features/proposal/components/VoteCollapsableList';
import { VoteTimeline } from 'features/proposal/components/VoteTimeline';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';
import { useProposalVotingDetails } from 'features/proposal/hooks';

import {
  useDelegatePageData,
  useVotingPolicyDetails,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/hooks';
import { getActiveTokenHolders } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/helpers';
import { extractMembersFromDao } from 'astro_2.0/features/CreateProposal/helpers';
import { MemberStats } from 'services/sputnik/mappers';

import styles from './Proposal.module.scss';

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
  const { tokens } = useDaoCustomTokens();
  const { t } = useTranslation();

  const { data: delegations } = useDelegatePageData(daoContext.dao);
  const { balance } = useVotingPolicyDetails(daoContext.dao);
  const activeTokenHolders = getActiveTokenHolders(delegations, balance);

  const members = dao
    ? extractMembersFromDao(dao, membersStats, activeTokenHolders)
    : [];

  const { votesDetails, votingPolicyByGroup } = useProposalVotingDetails(
    proposal,
    daoContext,
    members
  );

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
        <>
          <div className={styles.proposalInfo}>
            <ViewProposal
              proposal={proposal}
              showFlag={false}
              tokens={tokens}
            />
          </div>
          <div className={styles.votes}>
            <div className={styles.voteTitle}>{t('proposalVotes.title')}</div>
            <VoteTimeline proposal={proposal} />
          </div>
          <div className={styles.body}>
            <VoteCollapsableList
              data={votesDetails}
              votingPolicyByGroup={votingPolicyByGroup}
            />
          </div>
        </>
      </NestedDaoPageWrapper>
    </>
  );
};

export default ProposalPage;
