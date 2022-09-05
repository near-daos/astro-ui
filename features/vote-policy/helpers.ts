import { DAO, DaoVotePolicy, TGroup } from 'types/dao';
import { CreateProposalParams, Proposal } from 'types/proposal';
import snakeCase from 'lodash/snakeCase';
import { Vote, VoteDetail, VoterDetail } from 'features/types';
import difference from 'lodash/difference';
import isEmpty from 'lodash/isEmpty';
import { DefaultVotePolicy, ProposalAction } from 'types/role';
import { DATA_SEPARATOR } from 'constants/common';
import { dataRoleToContractRole, getThreshold } from 'features/groups/helpers';

export interface VotePolicy {
  whoCanVote?: string;
  voteBy?: 'Person' | 'Token';
  amount?: number;
  threshold?: string;
}

export type Scope =
  | 'addBounty'
  | 'config'
  | 'policy'
  | 'addMemberToRole'
  | 'removeMemberFromRole'
  | 'call'
  | 'upgradeSelf'
  | 'upgradeRemote'
  | 'transfer'
  | 'setVoteToken'
  | 'bountyDone'
  | 'vote';

export const getProposersList = (
  groups: TGroup[],
  scope: Scope,
  action: ProposalAction
): string[] => {
  return groups.reduce((res, item) => {
    const { permissions } = item;
    const isPermitted = permissions.find((permission: string) => {
      const [_scope, _action] = permission.split(':');

      return (
        (_scope === '*' || _scope === snakeCase(scope)) &&
        (_action === action || _action === '*')
      );
    });

    if (isPermitted) {
      res.push(item.name);
    }

    return res;
  }, [] as string[]);
};

export const getVotePolicyData = (
  name: string,
  votePolicy: DaoVotePolicy | null,
  defaultVotePolicy: DaoVotePolicy
): VotePolicy => {
  const policy =
    votePolicy && !isEmpty(votePolicy) ? votePolicy : defaultVotePolicy;

  return {
    // whoCanVote: name,
    voteBy: policy.weightKind === 'RoleWeight' ? 'Person' : 'Token',
    amount: (policy.ratio[0] / policy.ratio[1]) * 100,
    threshold: policy.kind === 'Ratio' ? '% of group' : 'persons',
  };
};

export type DaoSettingsProps = {
  externalLink: string;
  details: string;
  isDirty?: boolean;
};

export type Indexed = {
  [key: string]: VotePolicy | DaoSettingsProps;
};

export type VotingPolicyPageInitialData = {
  daoSettings: DaoSettingsProps;
  policy: VotePolicy;
} & Indexed;

export function formatPolicyRatio(defaultPolicy: DefaultVotePolicy): number {
  if (!(defaultPolicy?.ratio && defaultPolicy.ratio.length)) {
    return 0;
  }

  const ratio = (defaultPolicy.ratio[0] / defaultPolicy.ratio[1]) * 100;

  return Number(ratio.toFixed(2));
}

export const getInitialData = (
  dao?: DAO
): VotingPolicyPageInitialData | null => {
  if (!dao) {
    return null;
  }

  const defaultPolicy = dao.policy.defaultVotePolicy;

  return {
    policy: {
      voteBy: defaultPolicy.weightKind === 'RoleWeight' ? 'Person' : 'Token',
      amount: formatPolicyRatio(defaultPolicy),
      threshold: defaultPolicy.kind === 'Ratio' ? '% of group' : 'persons',
    },
    daoSettings: {
      externalLink: '',
      details: '',
    },
  };
};

export function getVoteDetails(
  numberOfMembers: number,
  defaultVotePolicy: {
    weightKind: string;
    kind: string;
    ratio: number[];
    quorum: string;
  },
  proposal?: Pick<
    Proposal,
    'voteYes' | 'voteNo' | 'voteRemove' | 'votes' | 'actions'
  > | null
): { details: VoteDetail; votersList: VoterDetail[] } {
  if (!defaultVotePolicy) {
    return {
      details: {
        limit: '',
        label: '',
      },
      votersList: [],
    };
  }

  const votesData = !proposal
    ? []
    : [
        {
          vote: 'Yes' as Vote,
          percent: (proposal.voteYes * 100) / numberOfMembers,
        },
        {
          vote: 'No' as Vote,
          percent: (proposal.voteNo * 100) / numberOfMembers,
        },
        {
          vote: 'Dismiss' as Vote,
          percent: (proposal.voteRemove * 100) / numberOfMembers,
        },
      ];

  const amount =
    (defaultVotePolicy.ratio[0] / defaultVotePolicy.ratio[1]) * 100;

  const details = {
    label: '',
    limit: `${amount}%`,
    data: votesData,
  };

  const list =
    proposal?.actions?.reduce<Record<string, VoterDetail>>((res, item) => {
      const vote = proposal.votes[item.accountId];

      if (res[item.accountId] && vote) {
        res[item.accountId] = {
          name: item.accountId,
          vote,
          timestamp: item.timestamp,
          id: item.id,
        };
      } else if (vote) {
        res[item.accountId] = {
          name: item.accountId,
          vote,
          timestamp: item.timestamp,
          id: item.id,
        };
      } else {
        res[item.accountId] = {
          name: item.accountId,
          vote: null,
          timestamp: null,
          id: item.id,
        };
      }

      return res;
    }, {}) ?? {};

  return { details, votersList: Object.values(list) };
}

export const getNewProposalObject = (
  dao: DAO,
  data: VotingPolicyPageInitialData
): CreateProposalParams => {
  return {
    daoId: dao.id,
    description: `${data.daoSettings.details}${DATA_SEPARATOR}${data.daoSettings.externalLink}`,
    kind: 'ChangePolicy',
    data: {
      policy: {
        roles: [...dao.policy.roles.map(dataRoleToContractRole)],
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
};

export function getNextGroup(
  allGroups: string[],
  selectedGroups: string[]
): string {
  const availableGroups = difference(allGroups, selectedGroups);

  return availableGroups[0] ?? '';
}
