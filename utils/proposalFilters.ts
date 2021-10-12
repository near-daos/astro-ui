import { Proposal, ProposalType } from 'types/proposal';

export function isTaskProposal(proposal: Proposal): boolean {
  const { type } = proposal.kind;

  return (
    type === ProposalType.AddBounty ||
    type === ProposalType.BountyDone ||
    type === ProposalType.Vote ||
    type === ProposalType.FunctionCall
  );
}

export function isGovernanceProposal(proposal: Proposal): boolean {
  const { type } = proposal.kind;

  return (
    type === ProposalType.ChangePolicy ||
    type === ProposalType.UpgradeRemote ||
    type === ProposalType.UpgradeSelf ||
    type === ProposalType.ChangeConfig
  );
}

export function isGroupProposal(proposal: Proposal): boolean {
  const { type } = proposal.kind;

  return (
    type === ProposalType.AddMemberToRole ||
    type === ProposalType.RemoveMemberFromRole
  );
}

export function isTreasuryProposal(proposal: Proposal): boolean {
  const { type } = proposal.kind;

  return (
    type === ProposalType.SetStakingContract || type === ProposalType.Transfer
  );
}
