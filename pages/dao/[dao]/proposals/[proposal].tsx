import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { GetServerSideProps, NextPage } from 'next';

import { DAO, Member } from 'types/dao';
import { Proposal } from 'types/proposal';
import { VoterDetail } from 'features/types';

import StatusFilters from 'astro_2.0/components/Feed/StatusFilters';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { DefaultVotingPolicy } from 'astro_2.0/components/DefaultVotingPolicy';
import { VotersList } from 'features/proposal/components/voters-list';
import { MobileProposalActions } from 'features/proposal/components/proposal-actions';
import { getScope } from 'components/cards/expanded-proposal-card/helpers';
import { Icon } from 'components/Icon';
import { ViewProposal } from 'astro_2.0/features/ViewProposal';

import { getVoteDetails } from 'features/vote-policy/helpers';

import { SputnikHttpService } from 'services/sputnik';
import { extractMembersFromDao } from 'services/sputnik/mappers';
import { useAuthContext } from 'context/AuthContext';

import styles from './proposal.module.scss';

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
}

const ProposalPage: NextPage<ProposalPageProps> = ({
  dao,
  proposal,
  members,
}) => {
  const { accountId } = useAuthContext();
  const scope = getScope(proposal?.kind.type);
  const [activeFilter, setActiveFilter] = useState<string | undefined>(
    undefined
  );
  const { fullVotersList, votersByStatus } = useMemo(() => {
    const { votersList } = getVoteDetails(dao, scope, proposal);

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

  const handleFilterChange = (value?: string) => async () => {
    setActiveFilter(value);
  };

  return (
    <div className={styles.root}>
      <div className={styles.breadcrumb}>
        <Link passHref href="/all/daos">
          <a href="*" className={styles.link}>
            <span className={styles.daoName}>All DAOs</span>
          </a>
        </Link>
        <span>
          <Icon name="buttonArrowRight" width={16} />
        </span>
        <Link passHref href={`/dao/${dao.id}`}>
          <a href="*" className={styles.link}>
            <span className={styles.daoName}>{dao.displayName || dao.id}</span>
          </a>
        </Link>
        <span>
          <Icon name="buttonArrowRight" width={16} />
        </span>
        <span className={styles.activeLink}>Proposal</span>
      </div>
      <div className={styles.mobileActions}>
        <MobileProposalActions />
      </div>
      <div className={styles.dao}>
        <DaoDetailsMinimized dao={dao} accountId={accountId} />
      </div>
      <div className={styles.proposalInfo}>
        <ViewProposal dao={dao} proposal={proposal} showFlag />
      </div>
      <div className={styles.policy}>
        <DefaultVotingPolicy
          policy={dao.policy.defaultVotePolicy}
          groups={dao.groups}
        />
      </div>
      <div className={styles.filters}>
        <StatusFilters
          proposal={activeFilter}
          filterName="vote"
          onChange={handleFilterChange}
          list={[
            { value: undefined, label: 'All', name: 'All' },
            {
              value: VoteStatuses.Approved,
              label: 'Approved',
              name: VoteStatuses.Approved,
            },
            {
              value: VoteStatuses.Failed,
              label: 'Failed',
              name: VoteStatuses.Failed,
            },
            {
              value: VoteStatuses.NotVoted,
              label: 'Not Voted',
              name: VoteStatuses.NotVoted,
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
      dao,
      proposal,
      members,
    },
  };
};
