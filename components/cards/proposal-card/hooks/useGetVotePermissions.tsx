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
      const groupRole = dao.policy.roles.find(r => r.kind === 'Group');

      if (groupRole) {
        const { accountIds, permissions: groupPerms } = groupRole;

        if (accountIds?.includes(accountId)) {
          const canApprove = checkPermissions('VoteApprove', groupPerms);
          const canReject = checkPermissions('VoteReject', groupPerms);
          const canDelete = checkPermissions('VoteRemove', groupPerms);

          setPermissions({
            canApprove,
            canReject,
            canDelete
          });
        }
      }
    }
  }, [dao, accountId, proposalType]);

  return permissions;
}
