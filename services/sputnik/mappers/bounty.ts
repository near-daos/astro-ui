import { BountyResponse } from 'types/bounties';
import { Bounty } from 'components/cards/bounty-card/types';
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
      starTime: claim.startTime
    })),
    deadlineThreshold: response.maxDeadline,
    slots: Number(response.times),
    id: response.bountyId,
    tokenId: response.token,
    description,
    externalUrl: url || ''
  };
};
