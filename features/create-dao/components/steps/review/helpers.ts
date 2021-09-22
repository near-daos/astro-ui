import { RolesRequest, VotePolicyRequest } from 'types/dao';
import { SputnikService } from 'services/SputnikService';
import { DAOFormValues } from 'features/create-dao/components/steps/types';

const EveryoneCanDoEverythingPolicy = {
  name: 'all',
  kind: 'Everyone',
  permissions: ['*:*'],
  vote_policy: {}
};

const EveryoneCanSubmitProposal = {
  name: 'all',
  kind: 'Everyone',
  permissions: ['*:AddProposal'],
  vote_policy: {}
};

const GroupMembersCanActOnProposals = {
  name: 'council',
  kind: { Group: [SputnikService.getAccountId()] },
  permissions: [
    '*:Finalize',
    '*:AddProposal',
    '*:VoteApprove',
    '*:VoteReject',
    '*:VoteRemove'
  ],
  vote_policy: {}
};

const DemocraticVoting = {
  weight_kind: 'RoleWeight',
  quorum: '0',
  threshold: [1, 2]
};

const TokenBasedVoting = {
  weight_kind: 'TokenWeight',
  quorum: '0',
  threshold: 5
};

export function getRolesVotingPolicy(
  data: DAOFormValues
): {
  roles: RolesRequest[];
  defaultVotePolicy: VotePolicyRequest;
} {
  const roles: RolesRequest[] = [];

  if (data.structure === 'flat') {
    roles.push(EveryoneCanDoEverythingPolicy);
  } else if (data.structure === 'groups') {
    roles.push(GroupMembersCanActOnProposals);

    if (data.proposals === 'open') {
      roles.push(EveryoneCanSubmitProposal);
    }
  }

  return {
    roles,
    defaultVotePolicy:
      data.voting === 'democratic' ? DemocraticVoting : TokenBasedVoting
  };
}
