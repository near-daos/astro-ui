import { ProposalFeedItem, ProposalType } from 'types/proposal';
import { DAO } from 'types/dao';

export type UserPermissions = {
  isCanCreateProposals: boolean;
  isCanCreatePolicyProposals: boolean;
  allowedProposalsToCreate: ProposalPermissions;
  allowedProposalsToVote: ProposalPermissions;
};

export type ProposalPermissions = {
  [ProposalType.ChangeConfig]: boolean;
  [ProposalType.ChangePolicy]: boolean;
  [ProposalType.AddBounty]: boolean;
  [ProposalType.BountyDone]: boolean;
  [ProposalType.Transfer]: boolean;
  [ProposalType.Vote]: boolean;
  [ProposalType.RemoveMemberFromRole]: boolean;
  [ProposalType.AddMemberToRole]: boolean;
  [ProposalType.AddMemberToRole]: boolean;
  [ProposalType.SetStakingContract]: boolean;
  [ProposalType.UpgradeSelf]: boolean;
  [ProposalType.UpgradeRemote]: boolean;
  [ProposalType.FunctionCall]: boolean;
};

export type DaoContext = {
  userPermissions: UserPermissions;
  dao: DAO;
  policyAffectsProposals: ProposalFeedItem[];
};
