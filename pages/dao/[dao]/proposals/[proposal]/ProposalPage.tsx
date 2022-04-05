import Head from 'next/head';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';

import { DAO, Member } from 'types/dao';
import { ProposalFeedItem } from 'types/proposal';
import { VoterDetail } from 'features/types';
import { DaoContext } from 'types/context';

import { DefaultVotingPolicy } from 'astro_2.0/components/DefaultVotingPolicy';
import { ProposalFilter } from 'astro_2.0/features/Proposals/components/ProposalFilter';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { getProposalScope } from 'utils/getProposalScope';
import { getVoteDetails } from 'features/vote-policy/helpers';
import { NestedDaoPageWrapper } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper';

import { VotersList } from 'features/proposal/components/voters-list';
import { useGetBreadcrumbsConfig } from 'hooks/useGetBreadcrumbsConfig';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';

import styles from './Proposal.module.scss';

interface ProposalPageProps {
  dao: DAO;
  proposal: ProposalFeedItem;
  availableGroups: string[];
  members: Member[];
  daoContext: DaoContext;
}

enum VoteStatuses {
  Approved = 'approved',
  Failed = 'failed',
  NotVoted = 'notVoted',
  All = 'all',
}

const ProposalPage: NextPage<ProposalPageProps> = ({
  dao,
  proposal,
  members,
  daoContext,
}) => {
  const router = useRouter();
  const scope = getProposalScope(proposal?.kind.type);
  const [activeFilter, setActiveFilter] = useState<string | undefined>(
    undefined
  );
  const { tokens } = useDaoCustomTokens();

  const { fullVotersList, votersByStatus } = useMemo(() => {
    if (!proposal) {
      return {
        votersByStatus: {},
        fullVotersList: [],
      };
    }

    const { votersList } = getVoteDetails(
      proposal.dao.numberOfMembers,
      proposal.dao.policy.defaultVotePolicy,
      scope,
      proposal
    );

    const voteActions = proposal?.actions
      .filter(
        item =>
          item.action === 'VoteApprove' ||
          item.action === 'VoteReject' ||
          item.action === 'VoteRemove'
      )
      .reduce((res, item) => {
        res[item.accountId] = item.transactionHash;

        return res;
      }, {} as Record<string, string>);

    const notVotedList = members.reduce((res, item) => {
      const voted = votersList.find(voter => voter.name === item.name);

      if (!voted) {
        res.push({
          name: item.name,
          groups: item.groups,
          vote: null,
        });
      }

      return res;
    }, [] as VoterDetail[]);

    const votersListData = [
      ...votersList.map(item => {
        const member = members.find(m => m.name === item.name);

        return {
          ...item,
          groups: member?.groups ?? [],
          transactionHash: voteActions[item.name],
        };
      }),
      ...notVotedList,
    ];

    const votersByStatusData = votersListData.reduce((res, item) => {
      let status;

      switch (item.vote) {
        case 'Yes': {
          status = 'approved';
          break;
        }
        case 'No': {
          status = 'failed';
          break;
        }
        default: {
          status = 'notVoted';
        }
      }

      if (res[status]) {
        res[status].push(item);
      } else {
        res[status] = [item];
      }

      return res;
    }, {} as Record<string, VoterDetail[]>);

    return {
      votersByStatus: votersByStatusData,
      fullVotersList: votersListData,
    };
  }, [proposal, scope, members]);

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
        <title>Astro</title>
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
          <div className={styles.policy}>
            <DefaultVotingPolicy
              ratio={proposal.dao.policy.defaultVotePolicy.ratio}
              numberOfGroups={dao.groups.length}
            />
          </div>
          <div className={styles.filters}>
            <ProposalFilter
              value={activeFilter || VoteStatuses.All}
              title="Filter by vote status:"
              onChange={value => {
                setActiveFilter(value === VoteStatuses.All ? undefined : value);
              }}
              list={[
                { value: VoteStatuses.All, label: 'All' },
                {
                  value: VoteStatuses.Approved,
                  label: 'Approved',
                },
                {
                  value: VoteStatuses.Failed,
                  label: 'Failed',
                },
                {
                  value: VoteStatuses.NotVoted,
                  label: 'Not Voted',
                },
              ]}
              className={styles.statusFilterRoot}
            />
          </div>
          <div className={styles.body}>
            <VotersList
              data={
                !activeFilter ? fullVotersList : votersByStatus[activeFilter]
              }
            />
          </div>
        </>
      </NestedDaoPageWrapper>
    </>
  );
};

export default ProposalPage;
