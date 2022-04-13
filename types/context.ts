import { ProposalFeedItem, ProposalType } from 'types/proposal';
import { DAO } from 'types/dao';

export type UserPermissions = {
  isCanCreateProposals: boolean;
  isCanCreatePolicyProposals: boolean;
  allowedProposalsToCreate: ProposalPermissions;
  allowedProposalsToVote: ProposalPermissions;
};

export type ProposalPermissions = {
  [ProposalType.ChangePolicy]: boolean;
  [ProposalType.AddBounty]: boolean;
  [ProposalType.Transfer]: boolean;
  [ProposalType.Vote]: boolean;
  [ProposalType.RemoveMemberFromRole]: boolean;
  [ProposalType.AddMemberToRole]: boolean;
  [ProposalType.AddMemberToRole]: boolean;
};

export type DaoContext = {
  userPermissions: UserPermissions;
  dao: DAO;
  policyAffectsProposals: ProposalFeedItem[];
};
