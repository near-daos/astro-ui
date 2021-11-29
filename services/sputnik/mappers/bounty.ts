import { Bounty, BountyResponse } from 'types/bounties';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';

export const mapBountyResponseToBounty = (response: BountyResponse): Bounty => {
  const [description, url] = response.description.split(
    EXTERNAL_LINK_SEPARATOR
  );

  return {
    amount: response.amount,
    forgivenessPeriod: response.dao.policy.bountyForgivenessPeriod,
    claimedBy: response.bountyClaims.map(claim => ({
      deadline: claim.deadline,
      accountId: claim.accountId,
      startTime: claim.startTime,
      endTime: claim.endTime,
    })),
    deadlineThreshold: response.maxDeadline,
    slots: Number(response.times) - Number(response.numberOfClaims),
    id: response.bountyId,
    tokenId: response.token,
    description,
    externalUrl: url || '',
  };
};
