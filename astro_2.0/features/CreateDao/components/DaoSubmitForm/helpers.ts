import { RolesRequest, VotePolicyRequest } from 'types/dao';
import { DAOFormValues } from 'astro_2.0/features/CreateDao/components/types';

const EveryoneCanDoEverything = (accountId: string) => ({
  name: 'Everyone',
  kind: { Group: [accountId] },
  permissions: [
    '*:Finalize',
    '*:AddProposal',
    '*:VoteApprove',
    '*:VoteReject',
    '*:VoteRemove',
  ],
  vote_policy: {},
});

const EveryoneCanSubmitProposal = {
  name: 'all',
  kind: 'Everyone',
  permissions: ['*:AddProposal'],
  vote_policy: {},
};

const GroupMembersCanActOnProposals = (
  groupName: string,
  accountId: string,
  votePolicy?: Record<string, VotePolicyRequest>
) => ({
  name: groupName,
  kind: { Group: [accountId] },
  permissions: [
    '*:Finalize',
    '*:AddProposal',
    '*:VoteApprove',
    '*:VoteReject',
    '*:VoteRemove',
  ],
  vote_policy: votePolicy || {},
});

const DemocraticVoting = {
  weight_kind: 'RoleWeight',
  quorum: '0',
  threshold: [1, 2],
};

const TokenBasedVoting = {
  weight_kind: 'TokenWeight',
  quorum: '0',
  threshold: '5',
};

export function getRolesVotingPolicy(
  data: Partial<DAOFormValues>,
  accountId: string
): {
  roles: RolesRequest[];
  defaultVotePolicy: VotePolicyRequest;
} {
  const roles: RolesRequest[] = [];

  if (data.structure === 'flat') {
    roles.push(EveryoneCanDoEverything(accountId), EveryoneCanSubmitProposal);
  } else if (data.structure === 'groups') {
    roles.push(GroupMembersCanActOnProposals('Council', accountId));

    if (data.proposals === 'open') {
      roles.push(EveryoneCanSubmitProposal);
    }

    if (data.voting === 'weighted') {
      roles.push(
        GroupMembersCanActOnProposals('Committee', accountId, {
          '*.*': TokenBasedVoting,
        })
      );
    }
  }

  return {
    roles,
    defaultVotePolicy: DemocraticVoting,
  };
}
