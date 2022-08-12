import React, { FC } from 'react';
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
import { ProposalFeedItem } from 'types/proposal';
import { MemberStats } from 'services/sputnik/mappers';

import styles from './ProposalPageContent.module.scss';

interface Props {
  daoContext: DaoContext;
  membersStats: MemberStats[];
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
  proposal: ProposalFeedItem;
}

export const ProposalPageContent: FC<Props> = ({
  daoContext,
  proposal,
  membersStats,
}) => {
  const { dao } = daoContext;
  const { t } = useTranslation();

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

  return (
    <>
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
        />
      </div>
    </>
  );
};
