import React, { FC, useCallback } from 'react';
import camelCase from 'lodash/camelCase';
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

import { SputnikService, yoktoNear } from 'services/SputnikService';
import { useAuthContext } from 'context/AuthContext';
import Decimal from 'decimal.js';

interface ProposalCardRendererProps {
  proposal: Proposal;
}

export const ProposalCardRenderer: FC<ProposalCardRendererProps> = ({
  proposal
}) => {
  const { accountId } = useAuthContext();
  let content;
  const handleVote = useCallback(() => {
    SputnikService.vote(proposal.daoId, proposal.proposalId, 'VoteApprove');
  }, [proposal.daoId, proposal.proposalId]);

  const handleUnvote = useCallback(() => {
    SputnikService.vote(proposal.daoId, proposal.proposalId, 'VoteReject');
  }, [proposal.daoId, proposal.proposalId]);

  const handleRemove = useCallback(() => {
    SputnikService.vote(proposal.daoId, proposal.proposalId, 'VoteRemove');
  }, [proposal.daoId, proposal.proposalId]);

  switch (proposal.kind.type) {
    case ProposalType.AddMemberToRole: {
      content = (
        <AddMemberToGroup
          name={proposal.proposer}
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
          name={proposal.proposer}
          groupName={proposal.kind.role}
          link="https://example.com"
          linkTitle="reddit.com"
        />
      );
      break;
    }
    case ProposalType.Transfer: {
      const amountYokto = new Decimal(proposal.kind.amount);
      const amount = amountYokto.div(yoktoNear).toFixed(2);

      content = (
        <RequestPayout
          amount={amount}
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

  const accId = camelCase(accountId);

  return (
    <ProposalCard
      type={proposal.kind.type}
      status={proposal.status}
      likes={proposal.voteYes}
      dislikes={proposal.voteNo}
      dismisses={proposal.voteRemove}
      id={proposal.id}
      title={proposal.proposer}
      liked={proposal.votes[accId] === 'Yes'}
      disliked={proposal.votes[accId] === 'No'}
      dismissed={proposal.votes[accId] === 'Dismiss'}
      onLike={handleVote}
      onDislike={handleUnvote}
      onRemove={handleRemove}
    >
      {content}
    </ProposalCard>
  );
};
