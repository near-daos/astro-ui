import { BountyStatus } from 'types/bounties';
import { BountyCardContent } from 'astro_2.0/components/BountyCard/types';
import { Proposal, ProposalType } from 'types/proposal';

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

export function getBountyDoneProposal(
  bountyContent: BountyCardContent,
  bountyDoneProposals: Proposal[]
): Proposal | undefined {
  const { id, status, accountId: bountyAccountId } = bountyContent;

  if (status !== BountyStatus.InProgress) {
    return undefined;
  }

  return bountyDoneProposals.find(proposal => {
    const { kind } = proposal;

    if (kind.type === ProposalType.BountyDone) {
      const { bountyId, receiverId } = kind;

      return id === bountyId && receiverId === bountyAccountId;
    }

    return false;
  });
}
