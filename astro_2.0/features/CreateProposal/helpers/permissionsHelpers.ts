import {
  getThreshold,
  VotingPolicyPageInitialData,
} from 'features/vote-policy/helpers';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';
import { dataRoleToContractRole } from 'features/groups/helpers';
import { DAO } from 'types/dao';
import { CreateProposalParams, ProposalType } from 'types/proposal';
import { SelectorRow } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/helpers';
import { DaoRole } from 'types/role';

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

  const newPermissions = role.permissions.filter(item => {
    let res = true;

    fields.forEach(field => {
      if (item.includes(field)) {
        res = false;
      }
    });

    return res; // !item.includes('AddProposal');
  });

  Object.keys(updatedRole).forEach(key => {
    switch (key) {
      case 'policy': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(`${ProposalType.ChangePolicy}:${field}`);
          });
        }

        break;
      }
      case 'bounty': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(`${ProposalType.AddBounty}:${field}`);
          });
        }

        break;
      }
      case 'transfer': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(`${ProposalType.Transfer}:${field}`);
          });
        }

        break;
      }
      case 'poll': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(`${ProposalType.Vote}:${field}`);
          });
        }

        break;
      }
      case 'removeMember': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(
              `${ProposalType.RemoveMemberFromRole}:${field}`
            );
          });
        }

        break;
      }
      case 'addMember': {
        if (updatedRole[key]) {
          fields.forEach(field => {
            newPermissions.push(`${ProposalType.AddMemberToRole}:${field}`);
          });
        }

        break;
      }
      // case 'group': {
      //   if (updatedRole[key]) {
      //     newPermissions.push(`${ProposalType.AddBounty}:AddProposal`);
      //   }
      //
      //   break;
      // }
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
  const roles = dao.policy.roles.map(role => {
    return updateRoleWithNewPermissions(proposedChanges, role, fields);
  }) as DaoRole[];

  return {
    daoId: dao.id,
    description: `${data.daoSettings.details}${EXTERNAL_LINK_SEPARATOR}${data.daoSettings.externalLink}`,
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
