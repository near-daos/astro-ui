import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import uniq from 'lodash/uniq';
import { GetServerSideProps, NextPage } from 'next';

import { DAO, Member } from 'types/dao';
import { Proposal } from 'types/proposal';

import { DefaultVotingPolicy } from 'features/proposal/components/default-voting-policy';
import { ProposalContent } from 'features/proposal/components/proposal-content';
import { VotersList } from 'features/proposal/components/voters-list';
import { filterByVote, getVoteDetails } from 'features/vote-policy/helpers';
import StatusFilter from 'features/proposal/components/status-filter';
import { VotingStatistic } from 'features/proposal/components/voting-statistic';
import {
  MobileProposalActions,
  ProposalActions
} from 'features/proposal/components/proposal-actions';
import { VoterDetail } from 'features/types';
import {
  getBadgeVariant,
  getProposalNameByType
} from 'features/proposal/helpers';
import { useDeviceType } from 'helpers/media';

import Tabs from 'components/tabs/Tabs';
import ExternalLink from 'components/cards/components/external-link/ExternalLink';
import { getScope } from 'components/cards/expanded-proposal-card/helpers';
import { Badge } from 'components/badge/Badge';
import { Icon } from 'components/Icon';
import { BondInfo } from 'components/bond';

import { SputnikHttpService } from 'services/sputnik';
import { extractMembersFromDao } from 'services/sputnik/mappers';

import styles from './proposal.module.scss';

interface ProposalPageProps {
  dao: DAO;
  proposal: Proposal;
  availableGroups: string[];
  members: Member[];
}

const ProposalPage: NextPage<ProposalPageProps> = ({
  dao,
  proposal,
  availableGroups,
  members
}) => {
  const router = useRouter();
  const voteStatus = (router.query.status ?? 'All') as string;
  const scope = getScope(proposal.kind.type);
  const { isTablet } = useDeviceType();
  const { details, votersByGroups } = useMemo(() => {
    const { details: votingDetails, votersList } = getVoteDetails(
      dao,
      scope,
      proposal
    );

    const votersListData = votersList.map(item => {
      const member = members.find(m => m.name === item.name);

      return {
        ...item,
        groups: member?.groups ?? []
      };
    });

    const votersByGroupsData = availableGroups.reduce((res, group) => {
      if (group === 'All Members') {
        res[group] = filterByVote(voteStatus, [...votersListData]);
      } else {
        res[group] = filterByVote(
          voteStatus,
          votersListData.filter(item => item.groups.includes(group))
        );
      }

      return res;
    }, {} as Record<string, VoterDetail[]>);

    return { details: votingDetails, votersByGroups: votersByGroupsData };
  }, [dao, scope, proposal, availableGroups, members, voteStatus]);

  const tabs = useMemo(() => {
    return availableGroups.map((item, i) => {
      return {
        id: i,
        label: (
          <Badge size="small" variant={getBadgeVariant(item)}>
            {item}
          </Badge>
        ),
        content: <VotersList data={votersByGroups[item]} />
      };
    });
  }, [availableGroups, votersByGroups]);

  return (
    <div className={styles.root}>
      <div className={styles.breadcrumb}>
        <Link passHref href={`/dao/${dao.id}`}>
          <a href="*" className={styles.link}>
            <div
              className={styles.daoFlag}
              style={{ backgroundImage: `url(${dao.logo})` }}
            />
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
      <div className={styles.proposalInfo}>
        <div className={styles.label}>Proposal Name</div>
        <div className={styles.title}>
          {getProposalNameByType(proposal.kind.type)}
        </div>
        <div className={styles.sub}>by {proposal.proposer}</div>
        <div className={styles.subheader}>
          <DefaultVotingPolicy policy={dao.policy.defaultVotePolicy} />
        </div>
        <div className={styles.row}>
          <ProposalContent proposal={proposal} />
          <BondInfo bond={dao.policy.proposalBond} />
        </div>
        <div className={styles.description}>
          <div className={styles.label}>Description</div>
          <p>{proposal?.description}</p>
        </div>
        {proposal.link && <ExternalLink to={proposal.link} />}
      </div>
      <div className={styles.proposalStat}>
        <VotingStatistic data={details.data} />
        {!isTablet && <ProposalActions />}
      </div>
      <div className={styles.body}>
        <h2>Votes by groups</h2>
        <Tabs tabs={tabs}>
          <StatusFilter />
        </Tabs>
      </div>
    </div>
  );
};

export default ProposalPage;

export const getServerSideProps: GetServerSideProps = async ({
  query
}): Promise<{
  props: {
    dao: DAO | null;
    proposal: Proposal | null;
    availableGroups: string[];
    members: Member[];
  };
}> => {
  const daoId = query.dao as string;
  const proposalId = query.proposal as string;

  const [dao, proposal] = await Promise.all([
    SputnikHttpService.getDaoById(daoId),
    SputnikHttpService.getProposalById(proposalId)
  ]);

  const members = dao && proposal ? extractMembersFromDao(dao, [proposal]) : [];

  const availableGroups = members.reduce<string[]>((res, item) => {
    res.push(...item.groups);

    return res;
  }, []);

  return {
    props: {
      dao,
      proposal,
      members,
      availableGroups: ['All Members', ...uniq(availableGroups)]
    }
  };
};
