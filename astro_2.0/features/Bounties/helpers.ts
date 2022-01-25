import { BountyContext, BountyStatus } from 'types/bounties';
import { differenceInMinutes } from 'date-fns';

export const BOUNTIES_PAGE_SORT_OPTIONS = [
  {
    label: 'Newest',
    value: 'createdAt,DESC',
  },
  {
    label: 'Oldest',
    value: 'createdAt,ASC',
  },
];

export const BOUNTIES_PAGE_FILTER_OPTIONS = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Available bounties',
    value: BountyStatus.Available,
  },
  {
    label: 'Claims in progress',
    value: BountyStatus.InProgress,
  },
  {
    label: 'Expired Claims',
    value: BountyStatus.Expired,
  },
];

export function prepareBountiesPageContent(
  data: BountyContext[]
): {
  proposalPhase: BountyContext[];
  bounties: BountyContext[];
  completed: BountyContext[];
} {
  const result = data.reduce<{
    proposalPhase: BountyContext[];
    bounties: BountyContext[];
    completed: BountyContext[];
  }>(
    (res, item) => {
      if (item.proposal && !item.bounty) {
        res.proposalPhase.push(item);

        return res;
      }

      if (
        item.bounty &&
        item.bounty.bountyDoneProposals
          .map(proposal => proposal.status)
          .filter(status => status === 'Approved').length ===
          Number(item.bounty.times)
      ) {
        res.completed.push(item);

        return res;
      }

      if (item.bounty) {
        res.bounties.push(item);

        return res;
      }

      return res;
    },
    {
      proposalPhase: [],
      bounties: [],
      completed: [],
    }
  );

  return result;
}

export function getClaimProgress(
  start: Date,
  end: Date,
  status: string
): number {
  const now = new Date();

  if (now > end || status !== 'InProgress') {
    return 100;
  }

  const totalLength = differenceInMinutes(end, start);
  const lengthFromNow = differenceInMinutes(now, start);

  return (lengthFromNow * 100) / totalLength;
}
