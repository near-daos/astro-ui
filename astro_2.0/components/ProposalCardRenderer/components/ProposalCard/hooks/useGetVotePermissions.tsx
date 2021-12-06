import { useEffect, useState } from 'react';

import { ProposalAction } from 'types/role';
import { ProposalType, ProposalVotingPermissions } from 'types/proposal';
import { DAO } from 'types/dao';
import { useMountedState } from 'react-use';

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
  [ProposalType.Vote]: 'vote',
};

export function useGetVotePermissions(
  dao: DAO,
  proposalType: ProposalType,
  accountId: string
): ProposalVotingPermissions {
  const [permissions, setPermissions] = useState<ProposalVotingPermissions>({
    canApprove: false,
    canReject: false,
    canDelete: false,
  });
  const isMounted = useMountedState();

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
          canDelete: false,
        }
      );

      if (isMounted()) {
        setPermissions(perms);
      }
    }
  }, [dao, accountId, proposalType, isMounted]);

  return permissions;
}
