import { VotingPolicyPageInitialData } from 'features/vote-policy/helpers';
import { DATA_SEPARATOR } from 'constants/common';
import { dataRoleToContractRole, getThreshold } from 'features/groups/helpers';
import { DAO } from 'types/dao';
import { CreateProposalParams, ProposalType } from 'types/proposal';
import { SelectorRow } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/helpers';
import { DaoPermission, DaoRole, DaoRoleKind } from 'types/role';
import { APP_TO_CONTRACT_PROPOSAL_TYPE } from 'utils/dataConverter';

type PermissionField =
  | 'AddProposal'
  | 'VoteApprove'
  | 'VoteReject'
  | 'VoteRemove';

export function updateRoleWithNewPermissions(
  proposedChanges: SelectorRow[],
  role: Pick<DaoRole, 'permissions' | 'name'>,
  fields: PermissionField[]
): DaoRole {
  const updatedRole = proposedChanges.find(item => item.label === role.name);

  if (!updatedRole) {
    return role as DaoRole;
  }

  let newPermissions = role.permissions;

  if (newPermissions.includes('*:*')) {
    newPermissions = [
      ...newPermissions,
      '*:Finalize',
      '*:AddProposal',
      '*:VoteApprove',
      '*:VoteReject',
      '*:VoteRemove',
    ];
  }

  newPermissions = newPermissions.filter(item => {
    let res = true;

    fields.forEach(field => {
      if (item.includes(field) || item === '*:*') {
        res = false;
      }
    });

    return res; // !item.includes('AddProposal');
  });

  Object.keys(updatedRole).forEach(key => {
    switch (key) {
      case 'config': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(
              `${
                APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.ChangeConfig]
              }:${field}` as DaoPermission
            );
          });
        }

        break;
      }
      case 'policy': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(
              `${
                APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.ChangePolicy]
              }:${field}` as DaoPermission
            );
          });
        }

        break;
      }
      case 'bounty': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(
              `${
                APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.AddBounty]
              }:${field}` as DaoPermission
            );
          });
        }

        break;
      }
      case 'bountyDone': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(
              `${
                APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.BountyDone]
              }:${field}` as DaoPermission
            );
          });
        }

        break;
      }
      case 'transfer': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(
              `${
                APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.Transfer]
              }:${field}` as DaoPermission
            );
          });
        }

        break;
      }
      case 'poll': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(
              `${
                APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.Vote]
              }:${field}` as DaoPermission
            );
          });
        }

        break;
      }
      case 'removeMember': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(
              `${
                APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.RemoveMemberFromRole]
              }:${field}` as DaoPermission
            );
          });
        }

        break;
      }
      case 'addMember': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(
              `${
                APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.AddMemberToRole]
              }:${field}` as DaoPermission
            );
          });
        }

        break;
      }
      case 'call': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(
              `${
                APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.FunctionCall]
              }:${field}` as DaoPermission
            );
          });
        }

        break;
      }
      case 'upgradeSelf': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(
              `${
                APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.UpgradeSelf]
              }:${field}` as DaoPermission
            );
          });
        }

        break;
      }
      case 'upgradeRemote': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(
              `${
                APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.UpgradeRemote]
              }:${field}` as DaoPermission
            );
          });
        }

        break;
      }
      case 'setStakingContract': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(
              `${
                APP_TO_CONTRACT_PROPOSAL_TYPE[ProposalType.SetStakingContract]
              }:${field}` as DaoPermission
            );
          });
        }

        break;
      }
      default: {
        break;
      }
    }
  });

  return {
    ...role,
    permissions: newPermissions,
  } as DaoRole;
}

export function getNewPermissionsProposalObject(
  dao: DAO,
  data: VotingPolicyPageInitialData,
  proposedChanges: SelectorRow[],
  permissionsFields: PermissionField | PermissionField[]
): CreateProposalParams {
  const fields = Array.isArray(permissionsFields)
    ? permissionsFields
    : [permissionsFields];

  const hasAll = dao.policy.roles.find(
    // TODO: check is there are only one role with kind Everyone
    // role => role.kind === 'Everyone' && role.slug === 'all'
    role => role.kind === 'Everyone'
  );

  let roles = hasAll
    ? dao.policy.roles
    : [
        {
          createdAt: new Date().toISOString(),
          id: `${dao.id}-all`,
          name: 'all',
          kind: 'Everyone' as DaoRoleKind,
          balance: null,
          accountIds: null,
          permissions: [],
          votePolicy: {},
        },
        ...dao.policy.roles,
      ];

  roles = roles.map(role => {
    return updateRoleWithNewPermissions(proposedChanges, role, fields);
  }) as DaoRole[];

  return {
    daoId: dao.id,
    description: `${data.daoSettings.details}${DATA_SEPARATOR}${data.daoSettings.externalLink}`,
    kind: 'ChangePolicy',
    data: {
      policy: {
        roles: [...roles.map(dataRoleToContractRole)],
        default_vote_policy: {
          quorum: '0',
          threshold: getThreshold(data.policy.amount as number),
          weight_kind: 'RoleWeight',
        },
        proposal_bond: dao.policy.proposalBond,
        proposal_period: dao.policy.proposalPeriod,
        bounty_bond: dao.policy.bountyBond,
        bounty_forgiveness_period: dao.policy.bountyForgivenessPeriod,
      },
    },
    bond: dao.policy.proposalBond,
  };
}
