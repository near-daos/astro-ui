import { DAO } from 'types/dao';
import { ProposalType, ProposalActions, ProposalVariant } from 'types/proposal';
import { APP_TO_CONTRACT_PROPOSAL_TYPE } from 'utils/dataConverter';
import { ProposalPermissions } from 'types/context';
import { PolicyType } from 'types/policy';

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

// check if user can perform some action on some proposal kind
export function checkUserPermission(
  accountId: string,
  policy: PolicyType,
  userHasDelegatedTokens: boolean,
  givenAction: ProposalActions,
  givenProposalType: ProposalType
): boolean {
  // get all the user's permissions on the chosen proposal kind
  const proposalKindPermissions: string[] = policy.roles
    ?.filter(
      role =>
        role.kind === 'Everyone' ||
        role.accountIds?.includes(accountId) ||
        (role.kind === 'Member' && userHasDelegatedTokens)
    )
    .map(role => role.permissions)
    .flat()
    .filter(permission => {
      const [proposalKind] = permission.split(':');

      return (
        proposalKind === '*' ||
        proposalKind === APP_TO_CONTRACT_PROPOSAL_TYPE[givenProposalType]
      );
    });

  // check if the user can perform the action on the proposal kind
  return proposalKindPermissions?.some(permission => {
    const [, action] = permission.split(':');

    return action === '*' || action === givenAction;
  });
}

export function getAllowedProposalsToCreate(
  accountId: string | null | undefined,
  dao: DAO | null,
  userHasDelegatedTokens: boolean
): ProposalPermissions {
  // Restrict create by default
  const result: getAllowedProposalsResultType = {
    [ProposalType.ChangeConfig]: false,
    [ProposalType.ChangePolicy]: false,
    [ProposalType.AddBounty]: false,
    [ProposalType.FunctionCall]: false,
    [ProposalType.Transfer]: false,
    [ProposalType.Vote]: false,
    [ProposalType.RemoveMemberFromRole]: false,
    [ProposalType.AddMemberToRole]: false,
    [ProposalType.UpgradeRemote]: false,
    [ProposalType.UpgradeSelf]: false,
    [ProposalType.SetStakingContract]: false,
    [ProposalType.BountyDone]: false,
  };

  // If no user account - restrict create
  if (!accountId) {
    return result;
  }

  if (dao?.policy) {
    // Iterate through roles and try to find relevant permissions in user's roles
    Object.keys(result).forEach(propType => {
      result[<getAllowedProposalsResultKeyType>propType] = checkUserPermission(
        accountId,
        dao.policy,
        userHasDelegatedTokens,
        ProposalActions.AddProposal,
        <getAllowedProposalsResultKeyType>propType
      );
    });
  }

  return result;
}

export function getAllowedProposalsToVote(
  accountId: string | null | undefined,
  dao: Pick<DAO, 'policy'> | null
): ProposalPermissions {
  // Restrict create by default
  const result: getAllowedProposalsResultType = {
    [ProposalType.ChangeConfig]: false,
    [ProposalType.ChangePolicy]: false,
    [ProposalType.AddBounty]: false,
    [ProposalType.FunctionCall]: false,
    [ProposalType.Transfer]: false,
    [ProposalType.Vote]: false,
    [ProposalType.RemoveMemberFromRole]: false,
    [ProposalType.AddMemberToRole]: false,
    [ProposalType.UpgradeRemote]: false,
    [ProposalType.UpgradeSelf]: false,
    [ProposalType.SetStakingContract]: false,
    [ProposalType.BountyDone]: false,
  };

  // If no user account - restrict vote
  if (!accountId) {
    return result;
  }

  // Iterate through roles and try to find relevant permissions in user's roles
  if (dao?.policy) {
    // Iterate through roles and try to find relevant permissions in user's roles
    Object.keys(result).forEach(propType => {
      // Can user VoteAppove or VoteRemove or VoteReject?
      result[<getAllowedProposalsResultKeyType>propType] =
        // check VoteApprove permission
        checkUserPermission(
          accountId,
          dao.policy,
          false,
          ProposalActions.VoteApprove,
          <getAllowedProposalsResultKeyType>propType
        ) ||
        // alternatively, check VoteReject permission
        checkUserPermission(
          accountId,
          dao.policy,
          false,
          ProposalActions.VoteReject,
          <getAllowedProposalsResultKeyType>propType
        ) ||
        // alternatively, check VoteRemove permission
        checkUserPermission(
          accountId,
          dao.policy,
          false,
          ProposalActions.VoteRemove,
          <getAllowedProposalsResultKeyType>propType
        );
    });
  }

  return result;
}

const policyAffectsProposalVariants = [
  ProposalVariant.ProposeChangeDaoLinks,
  ProposalVariant.ProposeChangeBonds,
  ProposalVariant.ProposeChangeDaoFlag,
  ProposalVariant.ProposeChangeDaoLegalInfo,
  ProposalVariant.ProposeChangeDaoName,
  ProposalVariant.ProposeChangeDaoPurpose,
  ProposalVariant.ProposeChangeVotingPolicy,
  ProposalVariant.ProposeCreateGroup,
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

type getAllowedProposalsResultType = {
  [ProposalType.ChangeConfig]: boolean;
  [ProposalType.ChangePolicy]: boolean;
  [ProposalType.AddBounty]: boolean;
  [ProposalType.BountyDone]: boolean;
  [ProposalType.FunctionCall]: boolean;
  [ProposalType.Transfer]: boolean;
  [ProposalType.Vote]: boolean;
  [ProposalType.RemoveMemberFromRole]: boolean;
  [ProposalType.AddMemberToRole]: boolean;
  [ProposalType.UpgradeRemote]: boolean;
  [ProposalType.UpgradeSelf]: boolean;
  [ProposalType.SetStakingContract]: boolean;
};
type getAllowedProposalsResultKeyType = keyof getAllowedProposalsResultType;
