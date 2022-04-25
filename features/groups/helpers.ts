import values from 'lodash/values';
import isEmpty from 'lodash/isEmpty';
import { DAO, VotePolicyRequest } from 'types/dao';
import { DaoRole, DefaultVotePolicy } from 'types/role';
import { CreateProposalParams } from 'types/proposal';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';

import { keysToSnakeCase } from 'utils/keysToSnakeCase';

import { IGroupForm } from './types';

function getAddRemoveMemberProposal(
  formData: IGroupForm,
  dao: DAO,
  isRemove?: boolean
): CreateProposalParams {
  const { id } = dao;
  const { details, group, memberName, externalUrl } = formData;

  return {
    daoId: id,
    description: `${details}${EXTERNAL_LINK_SEPARATOR}${externalUrl}`,
    kind: isRemove ? 'RemoveMemberFromRole' : 'AddMemberToRole',
    data: {
      member_id: memberName.trim(),
      role: group,
    },
    bond: dao.policy.proposalBond,
  };
}

export function getAddMemberProposal(
  formData: IGroupForm,
  dao: DAO
): CreateProposalParams {
  return getAddRemoveMemberProposal(formData, dao);
}

export function getRemoveMemberProposal(
  formData: IGroupForm,
  dao: DAO
): CreateProposalParams {
  return getAddRemoveMemberProposal(formData, dao, true);
}

type ContractRole = {
  name: string;
  kind: 'Everyone' | { Group: string[] | null };
  permissions: string[];
  // eslint-disable-next-line camelcase,@typescript-eslint/ban-types
  vote_policy: Record<string, VotePolicyRequest> | {};
};

function formatVotePolicy(value: DefaultVotePolicy) {
  return {
    weight_kind: value.weightKind,
    quorum: value.quorum,
    threshold: value.ratio ?? value.weight,
  };
}

function formatVotePolicies(
  data: Record<string, DefaultVotePolicy>
): Record<string, VotePolicyRequest> {
  return Object.keys(data).reduce((res, key) => {
    const value = data[key];

    res[key] = formatVotePolicy(value);

    return res;
  }, {} as Record<string, VotePolicyRequest>);
}

export function dataRoleToContractRole(role: DaoRole): ContractRole {
  const { name, kind, permissions, votePolicy, accountIds } = role;

  const newKind =
    kind === 'Group'
      ? {
          Group: accountIds,
        }
      : kind;

  return {
    name,
    kind: newKind,
    permissions: values(permissions),
    vote_policy:
      votePolicy && !isEmpty(votePolicy)
        ? formatVotePolicies(votePolicy)
        : ({} as Record<string, VotePolicyRequest>),
  };
}

export function getChangePolicyProposal(
  formData: IGroupForm,
  dao: DAO
): CreateProposalParams {
  const { id, policy } = dao;
  const { details, group, memberName, externalUrl } = formData;

  const members = memberName.split(', ');

  const {
    bountyBond,
    proposalBond,
    proposalPeriod,
    defaultVotePolicy,
    bountyForgivenessPeriod,
  } = policy;

  const { ratio, quorum, weightKind } = defaultVotePolicy;

  return {
    daoId: id,
    description: `${details}${EXTERNAL_LINK_SEPARATOR}${externalUrl}`,
    kind: 'ChangePolicy',
    data: {
      policy: {
        roles: [
          ...policy.roles.map(dataRoleToContractRole),
          {
            name: group,
            kind: {
              Group: members,
            },
            permissions: [
              '*:Finalize',
              '*:AddProposal',
              '*:VoteApprove',
              '*:VoteReject',
              '*:VoteRemove',
            ],
            vote_policy: {},
          },
        ],
        default_vote_policy: keysToSnakeCase({
          quorum,
          threshold: ratio,
          weightKind,
        }),
        proposal_bond: proposalBond,
        proposal_period: proposalPeriod,
        bounty_bond: bountyBond,
        bounty_forgiveness_period: bountyForgivenessPeriod,
      },
    },
    bond: dao.policy.proposalBond,
  };
}
