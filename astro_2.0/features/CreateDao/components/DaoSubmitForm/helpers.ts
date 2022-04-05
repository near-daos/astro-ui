import { RolesRequest, VotePolicyRequest } from 'types/dao';
import { DAOFormValues } from 'astro_2.0/features/CreateDao/components/types';

const EveryoneCanDoEverything = (accountIds: string[]) => ({
  name: 'Everyone',
  kind: { Group: accountIds },
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
  accountIds: string[],
  votePolicy?: Record<string, VotePolicyRequest>
) => ({
  name: groupName,
  kind: { Group: accountIds },
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
  accountIds: string[]
): {
  roles: RolesRequest[];
  defaultVotePolicy: VotePolicyRequest;
} {
  const roles: RolesRequest[] = [];

  if (data.structure === 'flat') {
    roles.push(EveryoneCanDoEverything(accountIds), EveryoneCanSubmitProposal);
  } else if (data.structure === 'groups') {
    roles.push(GroupMembersCanActOnProposals('Council', accountIds));

    if (data.proposals === 'open') {
      roles.push(EveryoneCanSubmitProposal);
    }

    if (data.voting === 'weighted') {
      roles.push(
        GroupMembersCanActOnProposals('Committee', accountIds, {
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
