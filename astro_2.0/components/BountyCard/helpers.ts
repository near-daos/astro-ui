import { addMilliseconds, formatDistance, isAfter } from 'date-fns';

import {
  BountyCardContent,
  BountyStatus,
} from 'astro_2.0/components/BountyCard/types';
import { Bounty, ClaimedBy } from 'components/cards/bounty-card/types';
import { Tokens } from 'context/CustomTokensContext';
import { DAO } from 'types/dao';

export const toMillis = (timePeriod: string): number =>
  Math.round(Number(timePeriod) / 1000000);

const calculateBountyStatus = (claim: ClaimedBy): BountyStatus => {
  return isAfter(
    Date.now(),
    addMilliseconds(toMillis(claim.startTime), toMillis(claim.deadline))
  )
    ? BountyStatus.Expired
    : BountyStatus.InProgress;
};

export const getDistanceFromNow = (timePeriod: string): string => {
  return formatDistance(new Date(toMillis(timePeriod)), 0, {
    addSuffix: true,
  });
};

export const getTimeTillComplete = (
  startTime: string,
  deadLineThreshold: string
): string => {
  const endDate = addMilliseconds(
    toMillis(startTime),
    toMillis(deadLineThreshold)
  );

  return formatDistance(endDate, Date.now(), { addSuffix: true });
};

export const mapBountyToCardContent = (
  dao: DAO,
  bounty: Bounty,
  tokens: Tokens,
  currentUser: string
): BountyCardContent[] => {
  const commonProps = {
    id: bounty.id,
    daoId: dao.id,
    amount: bounty.amount,
    description: bounty.description,
    externalUrl: bounty.externalUrl,
    forgivenessPeriod: bounty.forgivenessPeriod,
    token: bounty.tokenId === '' ? tokens.NEAR : tokens[bounty.tokenId],
    bountyBond: dao.policy.bountyBond,
  };

  const result: BountyCardContent[] = [];

  if (bounty.slots !== 0) {
    result.push({
      ...commonProps,
      status: BountyStatus.Available,
      timeToComplete: getDistanceFromNow(bounty.deadlineThreshold),
      slots: bounty.slots,
      claimedByCurrentUser: false,
    });
  }

  result.push(
    ...bounty.claimedBy.map(claim => {
      return {
        ...commonProps,
        status: calculateBountyStatus(claim),
        accountId: claim.accountId,
        claimedByCurrentUser: claim.accountId === currentUser,
        timeToComplete: getTimeTillComplete(claim.startTime, claim.deadline),
      };
    })
  );

  return result;
};

export const showActionBar = (
  bountyCardContent: BountyCardContent,
  account: string | undefined
): boolean => {
  if (!account) {
    return false;
  }

  if (bountyCardContent.status === BountyStatus.Available) {
    return true;
  }

  return (
    (bountyCardContent.status === BountyStatus.InProgress ||
      bountyCardContent.status === BountyStatus.Expired) &&
    bountyCardContent.accountId === account
  );
};
