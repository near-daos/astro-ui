import { DAO, DaoVotePolicy, TGroup, VotePolicyRequest } from 'types/dao';
import { VotePolicy } from 'features/vote-policy/components/policy-row';
import { CreateProposalParams, Proposal } from 'types/proposal';
import { keysToSnakeCase } from 'utils/keysToSnakeCase';
import snakeCase from 'lodash/snakeCase';
import { Vote, VoteDetail, VoterDetail } from 'features/types';
import difference from 'lodash/difference';
import isEmpty from 'lodash/isEmpty';
import { ProposalAction } from 'types/role';

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
    whoCanVote: name,
    voteBy: policy.weightKind === 'RoleWeight' ? 'Person' : 'Token',
    amount: (policy.ratio[0] / policy.ratio[1]) * 100,
    threshold: policy.kind === 'Ratio' ? '% of group' : 'persons'
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
};

export type PolicyProps = {
  whoCanPropose: string[];
  policies: VotePolicy[];
};

export type Indexed = {
  [key: string]: PolicyProps | DaoSettingsProps;
};

export type VotingPolicyPageInitialData = {
  daoSettings: DaoSettingsProps;
} & Indexed;

const POLICIES_VIEWS = [
  'addBounty',
  'bountyDone',
  'setVoteToken', // todo - is this a Create poll action?
  'call',
  'addMemberToRole',
  'removeMemberFromRole',
  'transfer',
  'upgradeSelf',
  'upgradeRemote',
  'config',
  'policy'
];

export const getInitialData = (
  dao?: DAO
): VotingPolicyPageInitialData | null => {
  if (!dao) return null;

  const views = POLICIES_VIEWS.reduce((res, item) => {
    res[item] = {
      whoCanPropose: getProposersList(dao.groups, item as Scope, 'AddProposal'),
      policies: getPoliciesList(
        dao.groups,
        item as Scope,
        ['VoteApprove', 'VoteReject', 'VoteRemove'],
        dao.policy.defaultVotePolicy
      )
    } as PolicyProps;

    return res;
  }, {} as VotingPolicyPageInitialData);

  return {
    ...views,
    daoSettings: {
      externalLink: '',
      details: ''
    }
  };
};

export function getVoteDetails(
  dao: DAO | null,
  scope: Scope,
  proposal?: Proposal | null
): { details: VoteDetail[]; votersList: VoterDetail[] } {
  if (!dao)
    return {
      details: [],
      votersList: []
    };

  const policiesList = getPoliciesList(
    dao.groups,
    scope,
    ['VoteApprove', 'VoteReject', 'VoteRemove'],
    dao.policy.defaultVotePolicy
  );

  const details = policiesList.map(item => {
    const group = dao.groups.find(gr => gr.name === item.whoCanVote);
    const totalMembers = group?.members.length ?? 0;

    const votesData = !proposal
      ? []
      : [
          {
            vote: 'Yes' as Vote,
            percent: (proposal.voteYes * 100) / totalMembers
          },
          {
            vote: 'No' as Vote,
            percent: (proposal.voteNo * 100) / totalMembers
          },
          {
            vote: 'Dismiss' as Vote,
            percent: (proposal.voteRemove * 100) / totalMembers
          }
        ];

    if (item.voteBy === 'Person') {
      return {
        label: item.whoCanVote ?? '',
        limit: `${item.amount} ${
          item.threshold === '% of group'
            ? '%'
            : `person${item.amount ?? 0 > 1 ? 's' : ''}`
        }`,
        data: votesData
      };
    }

    return {
      label: item.whoCanVote ?? '',
      limit: `${item.amount} ${item.threshold} tokens`,
      data: votesData
    };
  });

  const votersList = proposal?.votes
    ? Object.keys(proposal.votes).map(key => {
        return { name: key, vote: proposal.votes[key] };
      })
    : [];

  return { details, votersList };
}

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
    description: `${data.daoSettings.details} ${data.daoSettings.externalLink}`,
    kind: 'ChangePolicy',
    data: {
      policy: {
        roles: dao.policy.roles.map(role => {
          if (role.kind === 'Everyone') {
            return {
              name: 'all',
              kind: 'Everyone',
              permissions: ['*:AddProposal'],
              vote_policy: {}
            };
          }

          return {
            name: role.name,
            kind: {
              Group: role.accountIds
            },
            permissions: Object.keys(data).reduce((res, key) => {
              if (key !== 'daoSettings') {
                const { whoCanPropose, policies } = data[key] as PolicyProps;

                const voters = policies.map(item => item.whoCanVote);

                const snakeKey = snakeCase(key);

                if (whoCanPropose.includes(role.name)) {
                  res.push(`${snakeKey}:AddProposal`);
                }

                if (voters.includes(role.name)) {
                  res.push(`${snakeKey}:VoteApprove`);
                  res.push(`${snakeKey}:VoteReject`);
                  res.push(`${snakeKey}:VoteRemove`);
                  res.push(`${snakeKey}:VoteFinalize`);
                }
              }

              return res;
            }, [] as string[]),
            vote_policy: keysToSnakeCase(
              Object.keys(data).reduce((res, key) => {
                if (key !== 'daoSettings') {
                  const { policies } = data[key] as PolicyProps;
                  const values = policies.find(
                    item => item.whoCanVote === role.name
                  );

                  if (values) {
                    res[key] = {
                      weight_kind:
                        values?.voteBy === 'Person'
                          ? 'RoleWeight'
                          : 'TokenWeight',
                      quorum: '0',
                      threshold: getThreshold(values.amount ?? 0)
                    };
                  }
                }

                return res;
              }, {} as Record<string, VotePolicyRequest>)
            )
          };
        }),
        default_vote_policy: {
          quorum: '0',
          threshold: [1, 2],
          weight_kind: 'RoleWeight'
        },
        proposal_bond: dao.policy.proposalBond,
        proposal_period: dao.policy.proposalPeriod,
        bounty_bond: dao.policy.bountyBond,
        bounty_forgiveness_period: dao.policy.bountyForgivenessPeriod
      }
    },
    bond: dao.policy.proposalBond
  };
};

export function getNextGroup(
  allGroups: string[],
  selectedGroups: string[]
): string {
  const availableGroups = difference(allGroups, selectedGroups);

  return availableGroups[0] ?? '';
}
