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
  | 'ChangePolicy:AddProposal'
  | 'AddBounty:AddProposal'
  | 'Transfer:AddProposal'
  | 'Vote:AddProposal'
  | 'RemoveMemberFromRole:AddProposal'
  | 'AddMemberToRole:AddProposal'
  | 'ChangePolicy:VoteApprove'
  | 'AddBounty:VoteApprove'
  | 'Transfer:VoteApprove'
  | 'Vote:VoteApprove'
  | 'RemoveMemberFromRole:VoteApprove'
  | 'AddMemberToRole:VoteApprove'
  | 'ChangePolicy:VoteReject'
  | 'AddBounty:VoteReject'
  | 'Transfer:VoteReject'
  | 'Vote:VoteReject'
  | 'RemoveMemberFromRole:VoteReject'
  | 'AddMemberToRole:VoteReject'
  | 'ChangePolicy:VoteRemove'
  | 'AddBounty:VoteRemove'
  | 'Transfer:VoteRemove'
  | 'Vote:VoteRemove'
  | 'RemoveMemberFromRole:VoteRemove'
  | 'AddMemberToRole:VoteRemove';

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
