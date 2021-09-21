import React, { FC, useCallback } from 'react';
import { Proposal, ProposalType } from 'types/proposal';
import {
  AddMemberToGroup,
  ChangePolicy,
  FunctionCall,
  RemoveMemberFromGroup,
  RequestPayout,
  TextWithLink
} from 'components/cards/proposal-card/components/proposal-content/proposal-content';
import { ProposalCard } from 'components/cards/proposal-card/ProposalCard';

import { SputnikService } from 'services/SputnikService';
import { useAuthContext } from 'context/AuthContext';

interface ProposalCardRendererProps {
  proposal: Proposal;
}

export const ProposalCardRenderer: FC<ProposalCardRendererProps> = ({
  proposal
}) => {
  const { accountId } = useAuthContext();
  let content;
  const handleVote = useCallback(
    e => {
      if (e) {
        e.stopPropagation();
      }

      SputnikService.vote(proposal.daoId, proposal.proposalId, 'VoteApprove');
    },
    [proposal.daoId, proposal.proposalId]
  );

  const handleUnvote = useCallback(
    e => {
      if (e) {
        e.stopPropagation();
      }

      SputnikService.vote(proposal.daoId, proposal.proposalId, 'VoteReject');
    },
    [proposal.daoId, proposal.proposalId]
  );

  const handleRemove = useCallback(
    e => {
      if (e) {
        e.stopPropagation();
      }

      SputnikService.vote(proposal.daoId, proposal.proposalId, 'VoteRemove');
    },
    [proposal.daoId, proposal.proposalId]
  );

  switch (proposal.kind.type) {
    case ProposalType.AddMemberToRole: {
      content = (
        <AddMemberToGroup
          name={proposal.kind.memberId}
          groupName={proposal.kind.role}
          link="https://example.com"
          linkTitle="reddit.com"
        />
      );
      break;
    }
    case ProposalType.RemoveMemberFromRole: {
      content = (
        <RemoveMemberFromGroup
          name={proposal.kind.memberId}
          groupName={proposal.kind.role}
          link="https://example.com"
          linkTitle="reddit.com"
        />
      );
      break;
    }
    case ProposalType.Transfer: {
      content = (
        <RequestPayout
          amount={proposal.kind.amount}
          reason={proposal.kind.msg}
          recipient={proposal.kind.receiverId}
          tokens={proposal.kind.tokenId}
          link="https://example.com"
          linkTitle="reddit.com"
        />
      );
      break;
    }
    case ProposalType.FunctionCall: {
      content = (
        <FunctionCall
          recipient={proposal.kind.receiverId}
          link="https://example.com"
          linkTitle="reddit.com"
        />
      );
      break;
    }
    case ProposalType.ChangePolicy: {
      content = (
        <ChangePolicy link="https://example.com" linkTitle="reddit.com" />
      );
      break;
    }
    case ProposalType.Vote: {
      content = <TextWithLink text={proposal.description} />;
      break;
    }
    case ProposalType.AddBounty: {
      content = <TextWithLink text={proposal.description} />;
      break;
    }
    default: {
      content = null;
    }
  }

  return (
    <ProposalCard
      type={proposal.kind.type}
      status={proposal.status}
      likes={proposal.voteYes}
      dislikes={proposal.voteNo}
      dismisses={proposal.voteRemove}
      id={proposal.id}
      title={proposal.proposer}
      liked={proposal.votes[accountId] === 'Yes'}
      disliked={proposal.votes[accountId] === 'No'}
      dismissed={proposal.votes[accountId] === 'Dismiss'}
      onLike={handleVote}
      onDislike={handleUnvote}
      onRemove={handleRemove}
      votePeriodEnd={proposal.votePeriodEnd}
      daoDetails={proposal.daoDetails}
      proposalId={proposal.proposalId}
      daoId={proposal.daoId}
    >
      {content}
    </ProposalCard>
  );
};
