import React, { FC } from 'react';
import cn from 'classnames';

import { BountyProposal } from 'types/bounties';

import { ProposalControlButton } from 'astro_2.0/components/ProposalCardRenderer/components/ProposalCard/components/ProposalControlPanel/components/ProposalControlButton';

import { getVotesStatistic } from 'services/sputnik/mappers';

import { useBountyVoting } from 'astro_2.0/features/Bounties/components/hooks';

import { useCountdown } from 'hooks/useCountdown';
import { toMillis } from 'utils/format';

import { getProposalPermissions } from 'astro_2.0/features/ViewProposal/helpers';

import styles from './VotingContent.module.scss';

interface VotingContentProps {
  proposal: BountyProposal;
  accountId: string;
  daoId: string;
  className?: string;
}

export const VotingContent: FC<VotingContentProps> = ({
  proposal,
  accountId,
  daoId,
  className,
}) => {
  const { handleVote, loading } = useBountyVoting(daoId, proposal);

  const votesStat = getVotesStatistic(proposal);

  const liked = votesStat.votes[accountId] === 'Yes';
  const disliked = votesStat.votes[accountId] === 'No';
  const dismissed = votesStat.votes[accountId] === 'Dismiss';

  const permissions = getProposalPermissions(proposal, accountId);

  const { canApprove, canReject } = permissions;

  const votePeriodEnd = new Date(
    toMillis(proposal.votePeriodEnd)
  ).toISOString();
  const timeLeft = useCountdown(votePeriodEnd);

  const voted: boolean =
    liked ||
    disliked ||
    dismissed ||
    !!(proposal.status && proposal.status !== 'InProgress');
  const yesIconName = canApprove ? 'votingYes' : 'votingYesDisabled';
  const noIconName = canReject ? 'votingNo' : 'votingNoDisabled';

  return (
    <div className={cn(styles.root, className)}>
      <ProposalControlButton
        icon={liked ? 'votingYesChecked' : yesIconName}
        voted={voted}
        type="submit"
        className={styles.controlButton}
        times={votesStat.voteYes}
        onClick={e => {
          e.stopPropagation();
          handleVote('VoteApprove');
        }}
        disabled={Boolean(!canApprove || loading || !timeLeft)}
      />
      <ProposalControlButton
        icon={disliked ? 'votingNoChecked' : noIconName}
        voted={voted}
        type="submit"
        className={styles.controlButton}
        times={votesStat.voteNo}
        onClick={e => {
          e.stopPropagation();
          handleVote('VoteReject');
        }}
        disabled={Boolean(!canReject || loading || !timeLeft)}
      />
    </div>
  );
};
