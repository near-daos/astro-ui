import React, { useMemo, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { DAO, Member } from 'types/dao';
import { Proposal } from 'types/proposal';
import { VoterDetail } from 'features/types';

import { DefaultVotingPolicy } from 'astro_2.0/components/DefaultVotingPolicy';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { ProposalStatusFilter } from 'astro_2.0/features/Proposals/components/ProposalStatusFilter';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { NavLink } from 'astro_2.0/components/NavLink';

import { getProposalScope } from 'utils/getProposalScope';
import { getVoteDetails } from 'features/vote-policy/helpers';

import { VotersList } from 'features/proposal/components/voters-list';

import { extractMembersFromDao } from 'services/sputnik/mappers';
import { SputnikHttpService } from 'services/sputnik';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';

import styles from './Proposal.module.scss';

interface ProposalPageProps {
  dao: DAO;
  proposal: Proposal;
  availableGroups: string[];
  members: Member[];
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
}) => {
  const { t } = useTranslation();
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

    const { votersList } = getVoteDetails(dao, scope, proposal);

    const voteActions = proposal?.actions
      .filter(
        item => item.action === 'VoteApprove' || item.action === 'VoteReject'
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
  }, [dao, scope, proposal, members]);

  return (
    <div className={styles.root}>
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
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/all/daos">{t('allDais')}</NavLink>
        <NavLink href={`/dao/${dao.id}`}>{dao?.displayName || dao?.id}</NavLink>
        <NavLink>{t('proposals')}</NavLink>
        <NavLink href={`/dao/${dao.id}/proposals/${proposal?.id}`}>
          {proposal?.id}
        </NavLink>
      </BreadCrumbs>
      <div className={styles.dao}>
        <DaoDetailsMinimized dao={dao} />
      </div>
      <div className={styles.proposalInfo}>
        <ViewProposal
          dao={dao}
          proposal={proposal}
          showFlag={false}
          tokens={tokens}
        />
      </div>
      <div className={styles.policy}>
        <DefaultVotingPolicy
          policy={dao.policy.defaultVotePolicy}
          groups={dao.groups}
        />
      </div>
      <div className={styles.filters}>
        <ProposalStatusFilter
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
          data={!activeFilter ? fullVotersList : votersByStatus[activeFilter]}
        />
      </div>
    </div>
  );
};

export default ProposalPage;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale = 'en',
}): Promise<{
  props: {
    dao: DAO | null;
    proposal: Proposal | null;
    members: Member[];
  };
}> => {
  const daoId = query.dao as string;
  const proposalId = query.proposal as string;

  const [dao, proposal] = await Promise.all([
    SputnikHttpService.getDaoById(daoId),
    SputnikHttpService.getProposalById(proposalId),
  ]);

  const members = dao && proposal ? extractMembersFromDao(dao, [proposal]) : [];

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      dao,
      proposal,
      members,
    },
  };
};
