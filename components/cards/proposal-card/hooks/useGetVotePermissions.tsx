import { useEffect, useState } from 'react';

import { useDao } from 'hooks/useDao';
import { ProposalAction } from 'types/role';
import { ProposalType, ProposalVotingPermissions } from 'types/proposal';

const APP_TO_CONTRACT_PROPOSAL_TYPE = {
  [ProposalType.ChangeConfig]: 'config',
  [ProposalType.ChangePolicy]: 'policy',
  [ProposalType.AddMemberToRole]: 'add_member_to_role',
  [ProposalType.RemoveMemberFromRole]: 'remove_member_from_role',
  [ProposalType.FunctionCall]: 'call',
  [ProposalType.UpgradeSelf]: 'upgrade_self',
  [ProposalType.UpgradeRemote]: 'upgrade_remote',
  [ProposalType.Transfer]: 'transfer',
  [ProposalType.SetStakingContract]: 'set_vote_token',
  [ProposalType.AddBounty]: 'add_bounty',
  [ProposalType.BountyDone]: 'bounty_done',
  [ProposalType.Vote]: 'vote'
};

export function useGetVotePermissions(
  daoId: string,
  proposalType: ProposalType,
  accountId: string
): ProposalVotingPermissions {
  const dao = useDao(daoId);

  const [permissions, setPermissions] = useState<ProposalVotingPermissions>({
    canApprove: false,
    canReject: false,
    canDelete: false
  });

  useEffect(() => {
    function checkPermissions(
      permission: ProposalAction,
      groupPerms: string[]
    ) {
      const type = APP_TO_CONTRACT_PROPOSAL_TYPE[proposalType];

      return (
        groupPerms.includes('*:*') ||
        groupPerms.includes(`*:${permission}`) ||
        groupPerms.includes(`${type}:${permission}`)
      );
    }

    if (accountId && dao) {
      const groupRole = dao.policy.roles.filter(({ kind, accountIds }) => {
        return kind === 'Group' && accountIds?.includes(accountId);
      });

      const perms = groupRole.reduce(
        (acc, { permissions: groupPerms }) => {
          const { canApprove, canReject, canDelete } = acc;

          if (!canApprove) {
            acc.canApprove = checkPermissions('VoteApprove', groupPerms);
          }

          if (!canReject) {
            acc.canReject = checkPermissions('VoteReject', groupPerms);
          }

          if (!canDelete) {
            acc.canDelete = checkPermissions('VoteRemove', groupPerms);
          }

          return acc;
        },
        {
          canApprove: false,
          canReject: false,
          canDelete: false
        }
      );

      setPermissions(perms);
    }
  }, [dao, accountId, proposalType]);

  return permissions;
}
