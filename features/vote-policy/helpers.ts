import { DAO, DaoVotePolicy, TGroup } from 'types/dao';
import { VotePolicy } from 'features/vote-policy/components/policy-row';
import { CreateProposalParams, Proposal } from 'types/proposal';
import snakeCase from 'lodash/snakeCase';
import { Vote, VoteDetail, VoterDetail } from 'features/types';
import difference from 'lodash/difference';
import isEmpty from 'lodash/isEmpty';
import { ProposalAction } from 'types/role';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';
import { dataRoleToContractRole } from 'features/groups/helpers';

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

export const getPoliciesList = (
  groups: TGroup[],
  scope: Scope,
  action: ProposalAction | ProposalAction[],
  defaultVotePolicy: DaoVotePolicy
): VotePolicy[] => {
  return groups.reduce((res, item) => {
    const { permissions } = item;

    const expectedScope = snakeCase(scope);

    const isPermitted = permissions.find((permission: string) => {
      const [_scope, _action] = permission.split(':');

      const actions = Array.isArray(action) ? action : [action];

      let matched = false;

      actions.forEach(act => {
        if (_action === act || _action === '*') {
          matched = true;
        }
      });

      return (_scope === '*' || _scope === expectedScope) && matched;
    });

    if (isPermitted) {
      res.push(
        getVotePolicyData(
          item.name,
          item.votePolicy[expectedScope],
          defaultVotePolicy
        )
      );
    }

    return res;
  }, [] as VotePolicy[]);
};

export type DaoSettingsProps = {
  externalLink: string;
  details: string;
  isDirty?: boolean;
};

export type PolicyProps = {
  whoCanPropose: string[];
  policies: VotePolicy[];
  isDirty?: boolean;
};

export type Indexed = {
  [key: string]: VotePolicy | DaoSettingsProps;
};

export type VotingPolicyPageInitialData = {
  daoSettings: DaoSettingsProps;
  policy: VotePolicy;
} & Indexed;

export const getInitialData = (
  dao?: DAO
): VotingPolicyPageInitialData | null => {
  if (!dao) return null;

  const defaulPolicy = dao.policy.defaultVotePolicy;

  return {
    policy: {
      voteBy: defaulPolicy.weightKind === 'RoleWeight' ? 'Person' : 'Token',
      amount:
        defaulPolicy?.ratio && defaulPolicy.ratio.length
          ? (defaulPolicy.ratio[0] / defaulPolicy.ratio[1]) * 100
          : 0,
      threshold: defaulPolicy.kind === 'Ratio' ? '% of group' : 'persons',
    },
    daoSettings: {
      externalLink: '',
      details: '',
    },
  };
};

export function getVoteDetails(
  dao: DAO | null,
  scope: Scope,
  proposal?: Proposal | null
): { details: VoteDetail; votersList: VoterDetail[] } {
  if (!dao) {
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
          percent: (proposal.voteYes * 100) / dao.members,
        },
        {
          vote: 'No' as Vote,
          percent: (proposal.voteNo * 100) / dao.members,
        },
        {
          vote: 'Dismiss' as Vote,
          percent: (proposal.voteRemove * 100) / dao.members,
        },
      ];

  const defaulPolicy = dao.policy.defaultVotePolicy;

  const amount = (defaulPolicy.ratio[0] / defaulPolicy.ratio[1]) * 100;

  const details = {
    label: '',
    limit: `${amount}%`,
    data: votesData,
  };

  const list =
    proposal?.actions.reduce<Record<string, VoterDetail>>((res, item) => {
      const vote = proposal.votes[item.accountId];

      if (res[item.accountId] && vote) {
        res[item.accountId] = {
          name: item.accountId,
          vote,
          timestamp: item.timestamp,
        };
      } else if (vote) {
        res[item.accountId] = {
          name: item.accountId,
          vote,
          timestamp: item.timestamp,
        };
      } else {
        res[item.accountId] = {
          name: item.accountId,
          vote: null,
          timestamp: null,
        };
      }

      return res;
    }, {}) ?? {};

  const votersList = Object.values(list);

  return { details, votersList };
}

export const filterByVote = (
  voteStatus: string,
  votes: VoterDetail[]
): VoterDetail[] => {
  return votes.filter(item => {
    if (voteStatus === 'All') {
      return true;
    }

    if (voteStatus === 'Approved') {
      return item.vote === 'Yes';
    }

    if (voteStatus === 'Rejected') {
      return item.vote === 'No';
    }

    if (voteStatus === 'Not voted') {
      return item.vote === null;
    }

    return false;
  });
};

function getThreshold(value: number): [number, number] {
  const fraction = value / 100;
  const gcd = (a: number, b: number): number => {
    if (b < 0.0000001) return a; // Since there is a limited precision we need to limit the value.

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

export const getNewProposalObject = (
  dao: DAO,
  data: VotingPolicyPageInitialData
): CreateProposalParams => {
  return {
    daoId: dao.id,
    description: `${data.daoSettings.details}${EXTERNAL_LINK_SEPARATOR}${data.daoSettings.externalLink}`,
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
