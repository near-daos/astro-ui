import { DAO } from 'types/dao';
import { ProposalType, ProposalVariant } from 'types/proposal';
import { ProposalPermissions } from 'types/context';

export function isUserPermittedToCreateProposal(
  accountId: string | null | undefined,
  dao: DAO | null
): boolean {
  if (!accountId || !dao) {
    return false;
  }

  const daoRoles = dao.policy?.roles;

  if (!daoRoles) {
    return false;
  }

  let matched = false;

  daoRoles.forEach(role => {
    if (!role.accountIds && role.kind === 'Everyone') {
      if (
        role.permissions.includes('*:*') ||
        role.permissions.includes('*:AddProposal')
      ) {
        matched = true;
      }
    } else if (
      role.accountIds?.includes(accountId) &&
      (role.permissions.includes('*:*') ||
        role.permissions.includes('*:AddProposal'))
    ) {
      matched = true;
    }
  });

  return matched;
}

export function getAllowedProposalsToCreate(
  accountId: string | null | undefined,
  dao: DAO | null
): ProposalPermissions {
  // Restrict create by default
  const result = {
    [ProposalType.ChangeConfig]: false,
    [ProposalType.ChangePolicy]: false,
    [ProposalType.AddBounty]: false,
    [ProposalType.BountyDone]: false,
    [ProposalType.FunctionCall]: false,
    [ProposalType.Transfer]: false,
    [ProposalType.Vote]: false,
    [ProposalType.RemoveMemberFromRole]: false,
    [ProposalType.AddMemberToRole]: false,
    [ProposalType.UpgradeRemote]: false,
    [ProposalType.UpgradeSelf]: false,
    [ProposalType.SetStakingContract]: false,
  };

  // If no user account - restrict create
  if (!accountId) {
    return result;
  }

  // Iterate through roles and try to find relevant permissions in user's roles
  dao?.policy.roles.forEach(role => {
    if (role.kind === 'Everyone' || role.accountIds?.includes(accountId)) {
      role.permissions.forEach(permission => {
        switch (permission) {
          case '*:*':
          case '*:AddProposal': {
            result[ProposalType.ChangeConfig] = true;
            result[ProposalType.ChangePolicy] = true;
            result[ProposalType.AddBounty] = true;
            result[ProposalType.BountyDone] = true;
            result[ProposalType.FunctionCall] = true;
            result[ProposalType.Transfer] = true;
            result[ProposalType.Vote] = true;
            result[ProposalType.RemoveMemberFromRole] = true;
            result[ProposalType.AddMemberToRole] = true;
            result[ProposalType.UpgradeRemote] = true;
            result[ProposalType.UpgradeSelf] = true;
            result[ProposalType.SetStakingContract] = true;
            break;
          }
          case 'config:AddProposal': {
            result[ProposalType.ChangeConfig] = true;
            break;
          }
          case 'call:AddProposal': {
            result[ProposalType.FunctionCall] = true;
            break;
          }
          case 'bounty_done:AddProposal': {
            result[ProposalType.BountyDone] = true;
            break;
          }
          case 'policy:AddProposal': {
            result[ProposalType.ChangePolicy] = true;
            break;
          }
          case 'add_bounty:AddProposal': {
            result[ProposalType.AddBounty] = true;
            break;
          }
          case 'transfer:AddProposal': {
            result[ProposalType.Transfer] = true;
            break;
          }
          case 'vote:AddProposal': {
            result[ProposalType.Vote] = true;
            break;
          }
          case 'remove_member_from_role:AddProposal': {
            result[ProposalType.RemoveMemberFromRole] = true;
            break;
          }
          case 'add_member_to_role:AddProposal': {
            result[ProposalType.AddMemberToRole] = true;
            break;
          }

          // todo - temp disable some as they are hidden in ui
          case 'upgrade_self:AddProposal': {
            result[ProposalType.UpgradeSelf] = true;
            break;
          }
          case 'upgrade_remote:AddProposal': {
            result[ProposalType.UpgradeRemote] = true;
            break;
          }
          case 'set_vote_token:AddProposal': {
            result[ProposalType.SetStakingContract] = true;
            break;
          }

          default: {
            break;
          }
        }
      });
    }
  });

  return result;
}

export function getAllowedProposalsToVote(
  accountId: string | null | undefined,
  dao: DAO | null
): ProposalPermissions {
  // Restrict create by default
  const result = {
    [ProposalType.ChangeConfig]: false,
    [ProposalType.ChangePolicy]: false,
    [ProposalType.AddBounty]: false,
    [ProposalType.BountyDone]: false,
    [ProposalType.FunctionCall]: false,
    [ProposalType.Transfer]: false,
    [ProposalType.Vote]: false,
    [ProposalType.RemoveMemberFromRole]: false,
    [ProposalType.AddMemberToRole]: false,
    [ProposalType.UpgradeRemote]: false,
    [ProposalType.UpgradeSelf]: false,
    [ProposalType.SetStakingContract]: false,
  };

  // If no user account - restrict vote
  if (!accountId) {
    return result;
  }

  // Iterate through roles and try to find relevant permissions in user's roles
  dao?.policy.roles.forEach(role => {
    if (role.kind === 'Everyone' || role.accountIds?.includes(accountId)) {
      role.permissions.forEach(permission => {
        switch (permission) {
          case '*:*':
          case '*:VoteApprove':
          case '*:VoteReject':
          case '*:VoteRemove': {
            result[ProposalType.ChangePolicy] = true;
            result[ProposalType.AddBounty] = true;
            result[ProposalType.Transfer] = true;
            result[ProposalType.Vote] = true;
            result[ProposalType.RemoveMemberFromRole] = true;
            result[ProposalType.AddMemberToRole] = true;
            break;
          }
          case 'policy:VoteApprove':
          case 'policy:VoteReject':
          case 'policy:VoteRemove': {
            result[ProposalType.ChangePolicy] = true;
            break;
          }
          case 'add_bounty:VoteApprove':
          case 'add_bounty:VoteReject':
          case 'add_bounty:VoteRemove': {
            result[ProposalType.AddBounty] = true;
            break;
          }
          case 'transfer:VoteApprove':
          case 'transfer:VoteReject':
          case 'transfer:VoteRemove': {
            result[ProposalType.Transfer] = true;
            break;
          }
          case 'vote:VoteApprove':
          case 'vote:VoteReject':
          case 'vote:VoteRemove': {
            result[ProposalType.Vote] = true;
            break;
          }
          case 'remove_member_from_role:AddProposal':
          case 'remove_member_from_role:VoteReject':
          case 'remove_member_from_role:VoteRemove': {
            result[ProposalType.RemoveMemberFromRole] = true;
            break;
          }
          case 'add_member_to_role:AddProposal':
          case 'add_member_to_role:VoteReject':
          case 'add_member_to_role:VoteRemove': {
            result[ProposalType.AddMemberToRole] = true;
            break;
          }
          default: {
            break;
          }
        }
      });
    }
  });

  return result;
}

const policyAffectsProposalVariants = [
  ProposalVariant.ProposeChangeDaoLinks,
  ProposalVariant.ProposeAddMember,
  ProposalVariant.ProposeChangeBonds,
  ProposalVariant.ProposeChangeDaoFlag,
  ProposalVariant.ProposeChangeDaoLegalInfo,
  ProposalVariant.ProposeChangeDaoName,
  ProposalVariant.ProposeChangeDaoPurpose,
  ProposalVariant.ProposeChangeVotingPolicy,
  ProposalVariant.ProposeCreateGroup,
  ProposalVariant.ProposeRemoveMember,
  ProposalVariant.ProposeUpdateGroup,
];

export function getDefaultProposalVariantByType(
  type: ProposalType
): ProposalVariant {
  switch (type) {
    case ProposalType.ChangeConfig: {
      return ProposalVariant.ProposeChangeDaoName;
    }
    case ProposalType.ChangePolicy: {
      return ProposalVariant.ProposeChangeVotingPolicy;
    }
    case ProposalType.FunctionCall: {
      return ProposalVariant.ProposeCustomFunctionCall;
    }
    case ProposalType.Vote: {
      return ProposalVariant.ProposePoll;
    }
    case ProposalType.Transfer: {
      return ProposalVariant.ProposeTransfer;
    }
    case ProposalType.RemoveMemberFromRole: {
      return ProposalVariant.ProposeRemoveMember;
    }
    case ProposalType.AddMemberToRole: {
      return ProposalVariant.ProposeAddMember;
    }
    case ProposalType.AddBounty: {
      return ProposalVariant.ProposeCreateBounty;
    }
    default: {
      return ProposalVariant.ProposeDefault;
    }
  }
}

export function getProposalTypeByVariant(
  variant: ProposalVariant
): ProposalType | null {
  switch (variant) {
    case ProposalVariant.ProposeAddMember: {
      return ProposalType.AddMemberToRole;
    }
    case ProposalVariant.ProposeCreateBounty: {
      return ProposalType.AddBounty;
    }
    case ProposalVariant.ProposeDoneBounty: {
      return ProposalType.BountyDone;
    }
    case ProposalVariant.ProposeRemoveMember: {
      return ProposalType.RemoveMemberFromRole;
    }
    case ProposalVariant.ProposeTransfer: {
      return ProposalType.Transfer;
    }
    case ProposalVariant.ProposeChangeDaoLegalInfo:
    case ProposalVariant.ProposeChangeDaoName:
    case ProposalVariant.ProposeChangeDaoFlag:
    case ProposalVariant.ProposeChangeDaoLinks:
    case ProposalVariant.ProposeChangeDaoPurpose: {
      return ProposalType.ChangeConfig;
    }
    case ProposalVariant.ProposeCustomFunctionCall: {
      return ProposalType.FunctionCall;
    }
    case ProposalVariant.ProposePoll: {
      return ProposalType.Vote;
    }
    case ProposalVariant.ProposeChangeProposalCreationPermissions:
    case ProposalVariant.ProposeChangeProposalVotingPermissions:
    case ProposalVariant.ProposeChangeVotingPolicy:
    case ProposalVariant.ProposeChangeBonds:
    case ProposalVariant.ProposeUpdateGroup:
    case ProposalVariant.ProposeCreateGroup: {
      return ProposalType.ChangePolicy;
    }
    case ProposalVariant.ProposeTokenDistribution:
    case ProposalVariant.ProposeAcceptStakingContract:
    case ProposalVariant.ProposeStakingContractDeployment:
    case ProposalVariant.ProposeUpdateVotePolicyToWeightVoting:
    case ProposalVariant.ProposeCreateToken: {
      return ProposalType.SetStakingContract;
    }
    // these 2 proposals are for migrate dao
    case ProposalVariant.ProposeCreateDao:
    case ProposalVariant.ProposeTransferFunds:
    case ProposalVariant.ProposeRemoveUpgradeCode:
    case ProposalVariant.ProposeGetUpgradeCode:
    case ProposalVariant.ProposeUpgradeSelf: {
      return ProposalType.UpgradeSelf;
    }
    default: {
      return null;
    }
  }
}

export function getInitialProposalVariant(
  defaultProposalVariant: ProposalVariant,
  isCanCreatePolicyProposals: boolean,
  allowedProposalsToCreate: ProposalPermissions
): ProposalVariant {
  // Before we return initial proposal variant we have to check if user allowed to create corresponding proposals
  // So we first build an array of allowed proposal types as configured per user's groups
  const allowedProposals = Object.keys(allowedProposalsToCreate).reduce<
    ProposalType[]
  >((res, key) => {
    const value = (allowedProposalsToCreate as Record<string, boolean>)[key];

    if (value) {
      res.push(key as ProposalType);
    }

    return res;
  }, []);

  if (
    !isCanCreatePolicyProposals &&
    policyAffectsProposalVariants.includes(defaultProposalVariant)
  ) {
    if (allowedProposals.includes(ProposalType.Transfer)) {
      return ProposalVariant.ProposeTransfer;
    }

    // If user cannot create transfer proposals we return first available
    return getDefaultProposalVariantByType(allowedProposals[0]);
  }

  // Translate selected proposal variant to type as we know only permissions by type
  const defaultType = getProposalTypeByVariant(defaultProposalVariant);

  if (defaultType !== null && allowedProposals.includes(defaultType)) {
    return defaultProposalVariant;
  }

  // If user cannot create required proposals we return first available
  return getDefaultProposalVariantByType(allowedProposals[0]);
}
