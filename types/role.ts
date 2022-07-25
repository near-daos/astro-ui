export type ProposalAction =
  | 'Finalize'
  | 'AddProposal'
  | 'VoteApprove'
  | 'VoteReject'
  | 'VoteRemove';

export interface DefaultVotePolicy {
  weightKind: string;
  kind: string;
  ratio: number[];
  quorum: string;
  weight?: string;
}

export type DaoPermission =
  | '*:*'
  | '*:Finalize'
  | '*:AddProposal'
  | '*:VoteApprove'
  | '*:VoteReject'
  | '*:VoteRemove'
  | 'config:AddProposal'
  | 'policy:AddProposal'
  | 'add_bounty:AddProposal'
  | 'bounty_done:AddProposal'
  | 'transfer:AddProposal'
  | 'call:AddProposal'
  | 'vote:AddProposal'
  | 'remove_member_from_role:AddProposal'
  | 'add_member_to_role:AddProposal'
  | 'upgrade_self:AddProposal'
  | 'upgrade_remote:AddProposal'
  | 'set_vote_token:AddProposal'
  | 'config:VoteApprove'
  | 'call:VoteApprove'
  | 'upgrade_self:VoteApprove'
  | 'upgrade_remote:VoteApprove'
  | 'set_vote_token:VoteApprove'
  | 'bounty_done:VoteApprove'
  | 'policy:VoteApprove'
  | 'add_bounty:VoteApprove'
  | 'transfer:VoteApprove'
  | 'vote:VoteApprove'
  | 'remove_member_from_role:VoteApprove'
  | 'add_member_to_role:VoteApprove'
  | 'config:VoteReject'
  | 'call:VoteReject'
  | 'upgrade_self:VoteReject'
  | 'upgrade_remote:VoteReject'
  | 'set_vote_token:VoteReject'
  | 'bounty_done:VoteReject'
  | 'policy:VoteReject'
  | 'add_bounty:VoteReject'
  | 'transfer:VoteReject'
  | 'vote:VoteReject'
  | 'remove_member_from_role:VoteReject'
  | 'add_member_to_role:VoteReject'
  | 'config:VoteRemove'
  | 'call:VoteRemove'
  | 'upgrade_self:VoteRemove'
  | 'upgrade_remote:VoteRemove'
  | 'set_vote_token:VoteRemove'
  | 'bounty_done:VoteRemove'
  | 'policy:VoteRemove'
  | 'add_bounty:VoteRemove'
  | 'transfer:VoteRemove'
  | 'vote:VoteRemove'
  | 'remove_member_from_role:VoteRemove'
  | 'add_member_to_role:VoteRemove';

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
