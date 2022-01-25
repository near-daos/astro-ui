import React, { FC } from 'react';
import { useAsyncFn } from 'react-use';
import { useRouter } from 'next/router';

import { DAO } from 'types/dao';
import { Proposal, VoteAction } from 'types/proposal';

import { SputnikNearService } from 'services/sputnik';

import { ProposalControlButton } from 'astro_2.0/components/ProposalCardRenderer/components/ProposalCard/components/ProposalControlPanel/components/ProposalControlButton';
import { useGetVotePermissions } from 'astro_2.0/components/ProposalCardRenderer/components/ProposalCard/hooks/useGetVotePermissions';

interface VotingContentProps {
  proposal: Proposal;
  accountId: string;
  dao: DAO;
}

export const VotingContent: FC<VotingContentProps> = ({
  proposal,
  accountId,
  dao,
}) => {
  const router = useRouter();
  const [{ loading: voteLoading }, voteClickHandler] = useAsyncFn(
    async (vote: VoteAction, gas?: string | number) => {
      await SputnikNearService.vote(dao.id, proposal.proposalId, vote, gas);
      await router.reload();
    },
    [dao, proposal, router]
  );
  const permissions = useGetVotePermissions(dao, proposal.kind.type, accountId);
  const liked = proposal.votes[accountId] === 'Yes';
  const disliked = proposal.votes[accountId] === 'No';
  const dismissed = proposal.votes[accountId] === 'Dismiss';
  const disableControls = voteLoading;

  const { canApprove, canReject } = permissions;
  const voted =
    liked ||
    disliked ||
    dismissed ||
    (proposal.status && proposal.status !== 'InProgress');
  const yesIconName = canApprove ? 'votingYes' : 'votingYesDisabled';
  const noIconName = canReject ? 'votingNo' : 'votingNoDisabled';

  return (
    <div>
      <ProposalControlButton
        icon={liked ? 'votingYesChecked' : yesIconName}
        voted={voted}
        type="submit"
        times={proposal.voteYes}
        onClick={() => voteClickHandler('VoteApprove')}
        disabled={Boolean(!canApprove || disableControls)}
      />
      <ProposalControlButton
        icon={disliked ? 'votingNoChecked' : noIconName}
        voted={voted}
        type="submit"
        times={proposal.voteNo}
        onClick={() => voteClickHandler('VoteReject')}
        disabled={Boolean(!canReject || disableControls)}
      />
    </div>
  );
};
