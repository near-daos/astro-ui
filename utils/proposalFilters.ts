import { ProposalDetails, ProposalType } from 'types/proposal';

export function isTaskProposal(
  proposal: Pick<ProposalDetails, 'kind'>
): boolean {
  const { type } = proposal.kind;

  return (
    type === ProposalType.AddBounty ||
    type === ProposalType.BountyDone ||
    type === ProposalType.Vote ||
    type === ProposalType.FunctionCall
  );
}

export function isGovernanceProposal(
  proposal: Pick<ProposalDetails, 'kind'>
): boolean {
  const { type } = proposal.kind;

  return (
    type === ProposalType.ChangePolicy ||
    type === ProposalType.UpgradeRemote ||
    type === ProposalType.UpgradeSelf ||
    type === ProposalType.ChangeConfig
  );
}

export function isGroupProposal(
  proposal: Pick<ProposalDetails, 'kind'>
): boolean {
  const { type } = proposal.kind;

  return (
    type === ProposalType.AddMemberToRole ||
    type === ProposalType.RemoveMemberFromRole
  );
}

export function isTreasuryProposal(
  proposal: Pick<ProposalDetails, 'kind'>
): boolean {
  const { type } = proposal.kind;

  return (
    type === ProposalType.SetStakingContract || type === ProposalType.Transfer
  );
}
