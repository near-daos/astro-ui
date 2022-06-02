import values from 'lodash/values';
import isEmpty from 'lodash/isEmpty';
import { DAO, DaoVotePolicy, TGroup, VotePolicyRequest } from 'types/dao';
import { DaoRole } from 'types/role';
import { CreateProposalParams, ProposalType } from 'types/proposal';
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
/*
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
} */

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
        ? //   ? formatVotePolicies(votePolicy)
          votePolicy
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

export function getThreshold(value: number): [number, number] {
  const fraction = value / 100;
  const gcd = (a: number, b: number): number => {
    if (b < 0.0000001) {
      return a;
    } // Since there is a limited precision we need to limit the value.

    return gcd(b, Math.floor(a % b)); // Discard any fractions due to limitations in precision.
  };

  const len = fraction.toString().length - 2;

  let denominator = 10 ** len;
  let numerator = fraction * denominator;

  const divisor = gcd(numerator, denominator); // Should be 5

  numerator /= divisor; // Should be 687
  denominator /= divisor; // Should be 2000

  return [numerator, denominator];
}

export function generateVotePolicyForEachProposalType(
  quorum: string
): Record<string, DaoVotePolicy> {
  const policy: Record<string, DaoVotePolicy> = {};

  Object.keys(ProposalType).forEach(type => {
    policy[type] = keysToSnakeCase({
      quorum: '0',
      threshold: getThreshold(parseInt(quorum, 10)),
      weightKind: 'RoleWeight',
    });
  });

  return policy;
}

export function getUpdateGroupProposal(
  groups: TGroup[],
  formData: IGroupForm,
  dao: DAO
): CreateProposalParams {
  const { id } = dao;
  const { details, externalUrl } = formData;

  const {
    bountyBond,
    proposalBond,
    proposalPeriod,
    defaultVotePolicy,
    bountyForgivenessPeriod,
  } = dao.policy;

  const { ratio, quorum, weightKind } = defaultVotePolicy;

  return {
    daoId: id,
    description: `${details}${EXTERNAL_LINK_SEPARATOR}${externalUrl}`,
    kind: 'ChangePolicy',
    data: {
      policy: {
        roles: [
          ...dao.policy.roles
            .filter(role => role.kind !== 'Group')
            .map(dataRoleToContractRole),
          ...(groups.map(group => {
            const role = {
              name: group.name,
              kind: {
                Group: group.members,
              },
              permissions: [
                '*:Finalize',
                '*:AddProposal',
                '*:VoteApprove',
                '*:VoteReject',
                '*:VoteRemove',
              ],
              vote_policy: generateVotePolicyForEachProposalType(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                group.votePolicy.quorum
              ),
            };

            const oldGroupData = dao.policy.roles.find(
              el => el.id.replace(dao.id, '') === group.slug
            );

            if (oldGroupData) {
              return {
                ...oldGroupData,
                ...role,
                permissions: oldGroupData.permissions,
              };
            }

            return role;
          }) as ContractRole[]),
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
