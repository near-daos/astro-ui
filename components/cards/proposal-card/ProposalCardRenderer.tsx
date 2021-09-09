import React, { FC } from 'react';
import { Proposal, ProposalType } from 'types/proposal';
import {
  AddMemberToGroup,
  ChangePolicy,
  FunctionCall,
  RemoveMemberFromGroup,
  RequestPayout
} from 'components/cards/proposal-card/components/proposal-content/proposal-content';
import { ProposalCard } from 'components/cards/proposal-card/ProposalCard';

interface ProposalCardRendererProps {
  proposal: Proposal;
}

export const ProposalCardRenderer: FC<ProposalCardRendererProps> = ({
  proposal
}) => {
  let content;

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
      id={proposal.id}
      title={proposal.proposer}
      liked={false}
      disliked={false}
    >
      {content}
    </ProposalCard>
  );
};
