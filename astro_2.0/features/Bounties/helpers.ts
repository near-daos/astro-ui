import { BountyContext } from 'types/bounties';
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
    label: 'My',
    value: 'proposer',
  },
  {
    label: 'Complete',
    value: 'times',
  },
  {
    label: 'Empty',
    value: 'numberOfClaims',
  },
];

export function prepareBountyObject(
  bountyContext: BountyContext
): BountyContext {
  if (!bountyContext.bounty) {
    return bountyContext;
  }

  // generate claims based on approved/rejected proposals
  return {
    ...bountyContext,
    bounty: {
      ...bountyContext.bounty,
      bountyClaims: [
        ...bountyContext.bounty.bountyClaims,
        ...bountyContext.bounty.bountyDoneProposals
          .filter(proposal => {
            return proposal.status !== 'InProgress';
          })
          .map(proposal => ({
            id: proposal.id,
            accountId: proposal.proposer,
            startTime: '',
            deadline: bountyContext.bounty.maxDeadline,
            completed: true,
            endTime: '',
          })),
      ],
    },
  };
}

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

      if (item.bounty && Number(item.bounty.times) === 0) {
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
