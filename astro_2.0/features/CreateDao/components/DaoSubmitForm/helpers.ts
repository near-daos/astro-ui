import { RolesRequest, VotePolicyRequest } from 'types/dao';
import { DAOFormValues } from 'astro_2.0/features/CreateDao/components/types';
import { ProposalsStep, VotingStep } from 'astro_2.0/features/CreateDao/types';
import { updateRoleWithNewPermissions } from 'astro_2.0/features/CreateProposal/helpers/permissionsHelpers';
import { DaoPermission, DaoRole } from 'types/role';

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

export function getDetailedRolesVotingPolicy(
  proposals: ProposalsStep,
  voting: VotingStep,
  accountIds: { name: string; role: string }[],
  groups: { name: string; slug?: string }[]
): {
  roles: RolesRequest[];
  defaultVotePolicy: VotePolicyRequest;
} {
  // todo - use groups here
  // const oldGroups = ((proposals.data ?? []) as unknown) as { label: string }[];

  const roles: DaoRole[] = [...groups]
    .map(item => {
      if (item.slug === 'all') {
        return {
          name: item.name,
          slug: item.slug,
          kind: 'Everyone',
          permissions: ['*:AddProposal'] as DaoPermission[],
          vote_policy: {},
        };
      }

      return {
        name: item.name,
        slug: item.slug,
        kind: {
          Group: accountIds
            .filter(account => account.role === item.name)
            .map(account => account.name.trim()),
        },
        permissions: [
          '*:Finalize',
          '*:AddProposal',
          '*:VoteApprove',
          '*:VoteReject',
          '*:VoteRemove',
        ] as DaoPermission[],
        vote_policy: {},
      };
    })
    .map(role => {
      return updateRoleWithNewPermissions(proposals.data ?? [], role, [
        'AddProposal',
      ]);
    })
    .map(role => {
      return updateRoleWithNewPermissions(voting.data ?? [], role, [
        'VoteApprove',
        'VoteReject',
        'VoteRemove',
      ]);
    });

  return {
    roles: roles as unknown as RolesRequest[],
    defaultVotePolicy: DemocraticVoting,
  };
}
