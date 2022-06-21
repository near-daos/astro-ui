import { ProposalCategories, ProposalType } from 'types/proposal';

export function getDraftProposalTypeByCategory(
  category: ProposalCategories
): string | undefined {
  switch (category) {
    case ProposalCategories.Governance: {
      return `${ProposalType.ChangePolicy},${ProposalType.ChangeConfig}`;
    }
    case ProposalCategories.Financial: {
      return `${ProposalType.Transfer}`;
    }
    case ProposalCategories.Bounties: {
      return `${ProposalType.AddBounty},${ProposalType.BountyDone}`;
    }
    case ProposalCategories.Members: {
      return `${ProposalType.AddMemberToRole},${ProposalType.RemoveMemberFromRole}`;
    }
    case ProposalCategories.Polls: {
      return `${ProposalType.Vote}`;
    }
    case ProposalCategories.FunctionCalls: {
      return `${ProposalType.FunctionCall}`;
    }
    default: {
      return undefined;
    }
  }
}
