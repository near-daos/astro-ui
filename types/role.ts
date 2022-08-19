export type ProposalAction =
  | 'Finalize'
  | 'AddProposal'
  | 'RemoveProposal'
  | 'VoteApprove'
  | 'VoteReject'
  | 'VoteRemove'
  | 'MoveToHub';

export type ContractProposalType =
  | 'config'
  | 'policy'
  | 'add_member_to_role'
  | 'remove_member_from_role'
  | 'call'
  | 'upgrade_self'
  | 'upgrade_remote'
  | 'transfer'
  | 'set_vote_token'
  | 'add_bounty'
  | 'bounty_done'
  | 'vote'
  | 'factory_info_update'
  | 'policy_add_or_update_role'
  | 'policy_remove_role'
  | 'policy_update_default_vote_policy'
  | 'policy_update_parameters';

export interface DefaultVotePolicy {
  weightKind: string;
  kind: string;
  ratio: number[];
  quorum: string;
  weight?: string;
}

export type DaoPermission = `${'*' | ContractProposalType}:${
  | '*'
  | ProposalAction}`;

export type DaoRoleKind = 'Everyone' | 'Group' | 'Member';

export type DaoRole = {
  createdAt: string;
  id: string;
  name: string;
  kind: DaoRoleKind;
  balance: null;
  accountIds: string[] | null;
  permissions: DaoPermission[];
  votePolicy: Record<string, DefaultVotePolicy>;
};
