import { format, formatDistance } from 'date-fns';

import { BountyCardContent } from 'astro_2.0/components/BountyCard/types';
import { BountyStatus } from 'types/bounties';

export const toMillis = (timePeriod: string): number =>
  Math.round(Number(timePeriod) / 1000000);

export const getDistanceFromNow = (timePeriod: string): string => {
  return formatDistance(new Date(toMillis(timePeriod)), 0, {
    addSuffix: false,
  });
};

export const formatDate = (date: string): string => {
  return format(toMillis(date), 'd LLLL yyyy');
};

export const showActionBar = (
  bountyCardContent: BountyCardContent,
  account: string | undefined
): boolean => {
  const { status, accountId: bountyAccountId } = bountyCardContent;
  const { Expired, Available, InProgress, PendingApproval } = BountyStatus;

  if (!account) {
    return false;
  }

  if (status === Available || status === PendingApproval) {
    return true;
  }

  return (
    (status === InProgress || status === Expired) && bountyAccountId === account
  );
};
