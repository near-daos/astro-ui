import React, { FC } from 'react';
import { Proposal, ProposalType } from 'types/proposal';
import { AddMemberToGroup, ProposalCard } from 'components/cards/proposal-card';

interface ProposalCardRendererProps {
  proposal: Proposal;
}

const ProposalCardRenderer: FC<ProposalCardRendererProps> = ({ proposal }) => {
  let content;

  switch (proposal.kind.type) {
    case ProposalType.AddMemberToRole: {
      content = (
        <AddMemberToGroup
          name={proposal.proposer}
          groupName={proposal.kind.role}
        />
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

export default ProposalCardRenderer;
