import { ProposalType } from 'types/proposal';

export const APP_TO_CONTRACT_PROPOSAL_TYPE = {
  [ProposalType.ChangeConfig]: 'config',
  [ProposalType.ChangePolicy]: 'policy',
  [ProposalType.AddMemberToRole]: 'add_member_to_role',
  [ProposalType.RemoveMemberFromRole]: 'remove_member_from_role',
  [ProposalType.FunctionCall]: 'call',
  [ProposalType.UpgradeSelf]: 'upgrade_self',
  [ProposalType.UpgradeRemote]: 'upgrade_remote',
  [ProposalType.Transfer]: 'transfer',
  [ProposalType.SetStakingContract]: 'set_vote_token',
  [ProposalType.AddBounty]: 'add_bounty',
  [ProposalType.BountyDone]: 'bounty_done',
  [ProposalType.Vote]: 'vote',
};
