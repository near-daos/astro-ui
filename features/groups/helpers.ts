import { DAO } from 'types/dao';
import { CreateProposalParams } from 'types/proposal';

import { IGroupForm } from './types';

function getAddRemoveMemberProposal(
  formData: IGroupForm,
  dao: DAO,
  isRemove?: boolean
): CreateProposalParams {
  const { id } = dao;
  const { detail, group, memberName, externalUrl } = formData;

  return {
    daoId: id,
    description: `${detail} ${externalUrl}`,
    kind: isRemove ? 'RemoveMemberFromRole' : 'AddMemberToRole',
    data: {
      member_id: memberName,
      role: group
    },
    bond: '1000000000000000000000000'
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

export function getChangePolicyProposal(
  formData: IGroupForm,
  dao: DAO
): CreateProposalParams {
  const { id, policy } = dao;
  const { detail, group, memberName, externalUrl } = formData;

  const members = memberName.split(', ');

  const {
    bountyBond,
    proposalBond,
    proposalPeriod,
    defaultVotePolicy,
    bountyForgivenessPeriod
  } = policy;

  return {
    daoId: id,
    description: `${detail} ${externalUrl}`,
    kind: 'ChangePolicy',
    data: {
      policy: {
        default_vote_policy: defaultVotePolicy,
        proposal_bond: proposalBond,
        proposal_period: proposalPeriod,
        bounty_bond: bountyBond,
        bounty_forgiveness_period: bountyForgivenessPeriod,
        roles: [
          ...policy.roles,
          {
            kind: {
              group: members
            },
            name: group,
            // votePolicy: {},
            permissions: [
              '*:Finalize',
              '*:AddProposal',
              '*:VoteApprove',
              '*:VoteReject',
              '*:VoteRemove'
            ]
          }
        ]
      }
    },
    bond: '1000000000000000000000000'
  };
}
