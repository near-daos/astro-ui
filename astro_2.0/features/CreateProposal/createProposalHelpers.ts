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
    [ProposalType.ChangePolicy]: false,
    [ProposalType.AddBounty]: false,
    [ProposalType.Transfer]: false,
    [ProposalType.Vote]: false,
    [ProposalType.RemoveMemberFromRole]: false,
    [ProposalType.AddMemberToRole]: false,
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
            result[ProposalType.ChangePolicy] = true;
            result[ProposalType.AddBounty] = true;
            result[ProposalType.Transfer] = true;
            result[ProposalType.Vote] = true;
            result[ProposalType.RemoveMemberFromRole] = true;
            result[ProposalType.AddMemberToRole] = true;
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
    [ProposalType.ChangePolicy]: false,
    [ProposalType.AddBounty]: false,
    [ProposalType.Transfer]: false,
    [ProposalType.Vote]: false,
    [ProposalType.RemoveMemberFromRole]: false,
    [ProposalType.AddMemberToRole]: false,
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
];

export function getInitialProposalVariant(
  defaultProposalVariant: ProposalVariant,
  isCanCreatePolicyProposals: boolean
): ProposalVariant {
  if (
    !isCanCreatePolicyProposals &&
    policyAffectsProposalVariants.includes(defaultProposalVariant)
  ) {
    return ProposalVariant.ProposeTransfer;
  }

  return defaultProposalVariant;
}
