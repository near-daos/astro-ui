import { Proposal, ProposalType } from 'types/proposal';
import React, { FC } from 'react';
import { ProposedChangesRenderer } from 'components/cards/expanded-proposal-card/components/proposed-changes-renderer';
import {
  AddMemberToGroup,
  FunctionCall,
  RemoveMemberFromGroup
} from 'components/cards/proposal-card';
import { Transfer } from 'features/proposal/components/proposal-content/Transfer';

interface ProposalContentProps {
  proposal: Proposal;
}

export const ProposalContent: FC<ProposalContentProps> = ({ proposal }) => {
  switch (proposal.kind.type) {
    case ProposalType.AddMemberToRole: {
      return (
        <AddMemberToGroup
          name={proposal.kind.memberId}
          groupName={proposal.kind.role}
        />
      );
    }
    case ProposalType.RemoveMemberFromRole: {
      return (
        <RemoveMemberFromGroup
          name={proposal.kind.memberId}
          groupName={proposal.kind.role}
          link={proposal.link}
        />
      );
    }
    case ProposalType.Transfer: {
      return (
        <Transfer
          amount={proposal.kind.amount}
          recipient={proposal.kind.receiverId}
          token={proposal.kind.tokenId}
        />
      );
    }
    case ProposalType.FunctionCall: {
      return (
        <FunctionCall
          recipient={proposal.kind.receiverId}
          link={proposal.link}
        />
      );
    }
    case ProposalType.ChangePolicy: {
      return (
        <>
          <ProposedChangesRenderer
            dao={proposal.dao}
            proposal={proposal}
            inline
          />
        </>
      );
    }
    case ProposalType.Vote:
    case ProposalType.ChangeConfig:
    case ProposalType.AddBounty:
    default: {
      return null;
    }
  }
};
