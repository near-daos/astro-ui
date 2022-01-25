import { BountyContext, BountyStatus } from 'types/bounties';

export const getBountyStatus = (bountyContext: BountyContext): BountyStatus => {
  const { proposal, bounty } = bountyContext;

  if (proposal && !bounty) {
    return BountyStatus.Proposed;
  }

  if (bounty && bounty.bountyClaims.length === 0) {
    return BountyStatus.Available;
  }

  if (bounty && bounty.bountyClaims.length > 0) {
    return BountyStatus.InProgress;
  }

  return BountyStatus.Unknown;
};
