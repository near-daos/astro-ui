import { parseISO, differenceInMilliseconds } from 'date-fns';
import { useEffect } from 'react';
import useCountDown from 'react-countdown-hook';
import { ProposalType } from 'types/proposal';
import { Scope } from 'features/vote-policy/helpers';

function formatCountdown(seconds: number) {
  const d = Math.floor(seconds / (24 * 3600));
  const h = Math.floor((seconds - d * 24 * 3600) / 3600);
  const m = Math.floor((seconds - d * 24 * 3600 - h * 3600) / 60);

  let res = '';

  if (d > 0) {
    res += `${d}d `;
  }

  if (h > 0) {
    res += `${h}h `;
  }

  if (m > 0) {
    res += `${m}m `;
  }

  return res;
}

export function useCountdown(endsAt: string): string | null {
  const start = new Date();
  const end = parseISO(endsAt);

  const diff = differenceInMilliseconds(end, start);

  const [timeLeft, actions] = useCountDown(diff, 1000 * 60);

  useEffect(() => {
    actions.start();
  }, [actions]);

  return timeLeft > 0 ? formatCountdown(timeLeft / 1000) : null;
}

export function getScope(proposalType: ProposalType): Scope {
  switch (proposalType) {
    case 'ChangePolicy':
      return 'policy';
    case ProposalType.AddBounty:
      return 'addBounty';
    case ProposalType.BountyDone:
      return 'bountyDone';
    case ProposalType.AddMemberToRole:
      return 'addMemberToRole';
    case ProposalType.RemoveMemberFromRole:
      return 'removeMemberFromRole';
    case ProposalType.FunctionCall:
      return 'call';
    case ProposalType.Transfer:
      return 'transfer';
    case ProposalType.UpgradeRemote:
      return 'upgradeRemote';
    case ProposalType.UpgradeSelf:
      return 'upgradeSelf';
    case ProposalType.Vote:
      return 'vote';
    case ProposalType.SetStakingContract:
    case ProposalType.ChangeConfig:
    default:
      return 'config';
  }
}
