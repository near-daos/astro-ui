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
  weight: string;
}

export type DaoPermission =
  | '*:*'
  | '*:Finalize'
  | '*:AddProposal'
  | '*:VoteApprove'
  | '*:VoteReject'
  | '*:VoteRemove'
  | 'policy:AddProposal'
  | 'add_bounty:AddProposal'
  | 'transfer:AddProposal'
  | 'vote:AddProposal'
  | 'remove_member_from_role:AddProposal'
  | 'add_member_to_role:AddProposal'
  | 'policy:VoteApprove'
  | 'add_bounty:VoteApprove'
  | 'transfer:VoteApprove'
  | 'vote:VoteApprove'
  | 'remove_member_from_role:VoteApprove'
  | 'add_member_to_role:VoteApprove'
  | 'policy:VoteReject'
  | 'add_bounty:VoteReject'
  | 'transfer:VoteReject'
  | 'vote:VoteReject'
  | 'remove_member_from_role:VoteReject'
  | 'add_member_to_role:VoteReject'
  | 'policy:VoteRemove'
  | 'add_bounty:VoteRemove'
  | 'transfer:VoteRemove'
  | 'vote:VoteRemove'
  | 'remove_member_from_role:VoteRemove'
  | 'add_member_to_role:VoteRemove';

export type DaoRole = {
  createdAt: string;
  id: string;
  name: string;
  kind: 'Everyone' | 'Group';
  balance: null;
  accountIds: string[] | null;
  permissions: DaoPermission[];
  votePolicy: Record<string, DefaultVotePolicy>;
};
