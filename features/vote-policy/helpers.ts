import { DAO, DaoVotePolicy, TGroup } from 'types/dao';
import { VotePolicy } from 'features/vote-policy/components/policy-row';
import { CreateProposalParams } from 'types/proposal';
import { keysToSnakeCase } from 'utils/keysToSnakeCase';

type Scope =
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

type Action =
  | 'Finalize'
  | 'AddProposal'
  | 'VoteApprove'
  | 'VoteReject'
  | 'VoteRemove';

export const getProposersList = (
  groups: TGroup[],
  scope: Scope,
  action: Action
): string[] => {
  return groups.reduce((res, item) => {
    const { permissions } = item;
    const isPermitted = permissions.find((permission: string) => {
      const [_scope, _action] = permission.split(':');

      return (
        (_scope === '*' || _scope === scope) &&
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
  const policy = votePolicy || defaultVotePolicy;

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
  action: Action | Action[],
  defaultVotePolicy: DaoVotePolicy
): VotePolicy[] => {
  return groups.reduce((res, item) => {
    const { permissions } = item;

    const isPermitted = permissions.find((permission: string) => {
      const [_scope, _action] = permission.split(':');

      const actions = Array.isArray(action) ? action : [action];

      let matched = false;

      actions.forEach(act => {
        if (_action === act || _action === '*') {
          matched = true;
        }
      });

      return (_scope === '*' || _scope === scope) && matched;
    });

    if (isPermitted) {
      res.push(
        getVotePolicyData(item.name, item.votePolicy, defaultVotePolicy)
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
  whoCanPropose: string;
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
  'setVoteToken',
  'call',
  'addMemberToRole',
  'removeMemberFromRole',
  'transfer',
  'upgradeSelf',
  'upgradeRemote',
  'config'
];

export const getInitialData = (
  dao?: DAO
): VotingPolicyPageInitialData | null => {
  if (!dao) return null;

  const views = POLICIES_VIEWS.reduce((res, item) => {
    res[item] = {
      whoCanPropose: getProposersList(
        dao.groups,
        item as Scope,
        'AddProposal'
      )[0],
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
      externalLink: dao?.link ?? '',
      details: dao?.description ?? ''
    }
  };
};

// ProposalKind::ChangeConfig { .. } => "config",
//   ProposalKind::ChangePolicy { .. } => "policy",
//   ProposalKind::AddMemberToRole { .. } => "add_member_to_role",
//   ProposalKind::RemoveMemberFromRole { .. } => "remove_member_from_role",
//   ProposalKind::FunctionCall { .. } => "call",
//   ProposalKind::UpgradeSelf { .. } => "upgrade_self",
//   ProposalKind::UpgradeRemote { .. } => "upgrade_remote",
//   ProposalKind::Transfer { .. } => "transfer",
//   ProposalKind::SetStakingContract { .. } => "set_vote_token",
//   ProposalKind::AddBounty { .. } => "add_bounty",
//   ProposalKind::BountyDone { .. } => "bounty_done",
//   ProposalKind::Vote => "vote",

type VotePolicyRequest = {
  // eslint-disable-next-line camelcase
  weight_kind: 'RoleWeight' | 'TokenWeight';
  quorum: string;
  threshold: [number, number];
};

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
            permissions: [...role.permissions],
            vote_policy: keysToSnakeCase(
              Object.keys(data).reduce((res, key) => {
                if (key !== 'daoSettings') {
                  const values = data[key] as VotePolicy;

                  res[key] = {
                    weight_kind:
                      values.voteBy === 'Person' ? 'RoleWeight' : 'TokenWeight',
                    quorum: '0',
                    threshold: [4, 5]
                  };
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
