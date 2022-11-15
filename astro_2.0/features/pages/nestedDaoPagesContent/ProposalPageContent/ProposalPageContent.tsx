import React, { FC } from 'react';
import Head from 'next/head';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useAsync } from 'react-use';
import { useRouter } from 'next/router';

import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { VoteTimeline } from 'features/proposal/components/VoteTimeline';
import { VoteCollapsableList } from 'features/proposal/components/VoteCollapsableList';
import { useTranslation } from 'next-i18next';
import {
  useDelegatePageData,
  useVotingPolicyDetails,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/hooks';
import { getActiveTokenHolders } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/helpers';
import { extractMembersFromDao } from 'astro_2.0/features/CreateProposal/helpers';
import { useProposalVotingDetails } from 'features/proposal/hooks';
import { DaoContext } from 'types/context';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { MemberStats } from 'services/sputnik/mappers';

import { useTimelineData } from 'features/proposal/components/VoteTimeline/hooks';

import { useProposal } from 'services/ApiService/hooks/useProposal';

import { SputnikHttpService } from 'services/sputnik';
import { useWalletContext } from 'context/WalletContext';

import styles from './ProposalPageContent.module.scss';

interface Props {
  daoContext: DaoContext;
  membersStats: MemberStats[];
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const ProposalPageContent: FC<Props> = ({
  daoContext,
  membersStats,
}) => {
  const router = useRouter();
  const { dao } = daoContext;
  const { t } = useTranslation();
  const { proposal: proposalData } = useProposal();
  const { accountId } = useWalletContext();
  const { useOpenSearchDataApi } = useFlags();

  // Temp - to fetch data from old API until we fully migrate to opensearch
  const { value } = useAsync(async () => {
    if (useOpenSearchDataApi) {
      return undefined;
    }

    return SputnikHttpService.getProposalById(
      router.query.proposal as string,
      accountId
    );
  }, [accountId]);

  const proposal = value || proposalData;

  const { data: delegations } = useDelegatePageData(dao);
  const { balance } = useVotingPolicyDetails(dao);
  const activeTokenHolders = getActiveTokenHolders(delegations, balance);

  const members = dao
    ? extractMembersFromDao(dao, membersStats, activeTokenHolders)
    : [];

  const { votesDetails, votingPolicyByGroup } = useProposalVotingDetails(
    proposal,
    daoContext,
    members
  );

  const { lastVote } = useTimelineData(proposal, proposal?.actions.length ?? 0);

  if (!proposal) {
    return null;
  }

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
      <div className={styles.proposalInfo}>
        <ViewProposal
          key={proposal.id}
          proposal={proposal}
          showFlag={false}
          userPermissions={daoContext.userPermissions}
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
          lastVoteId={lastVote?.action?.id}
        />
      </div>
    </>
  );
};
