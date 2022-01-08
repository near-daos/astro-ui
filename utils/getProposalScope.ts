import { ProposalType } from 'types/proposal';
import { Scope } from 'features/vote-policy/helpers';

export function getProposalScope(proposalType: ProposalType): Scope {
  switch (proposalType) {
    case ProposalType.ChangePolicy:
      return 'policy';
    case ProposalType.AddBounty:
      return 'addBounty';
    case ProposalType.BountyDone:
      return 'bountyDone';
    case ProposalType.AddMemberToRole:
      return 'addMemberToRole';
    case ProposalType.RemoveMemberFromRole:
      return 'removeMemberFromRole';
    case ProposalType.FunctionCall:
      return 'call';
    case ProposalType.Transfer:
      return 'transfer';
    case ProposalType.UpgradeRemote:
      return 'upgradeRemote';
    case ProposalType.UpgradeSelf:
      return 'upgradeSelf';
    case ProposalType.Vote:
      return 'vote';
    case ProposalType.SetStakingContract:
    case ProposalType.ChangeConfig:
    default:
      return 'config';
  }
}
