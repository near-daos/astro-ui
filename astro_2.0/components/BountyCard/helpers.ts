import { addMilliseconds, formatDistance, isBefore } from 'date-fns';

import { BountyStatus } from 'astro_2.0/components/BountyCard/types';
import { TooltipMessageSeverity } from 'astro_2.0/components/InfoBlockWidget/types';

export const toMillis = (timePeriod: string): number =>
  Math.round(Number(timePeriod) / 1000000);

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

export const getSeverity = (
  bountyStatus: BountyStatus,
  forgivenessPeriod: string,
  startTime?: string
): TooltipMessageSeverity => {
  if (bountyStatus === 'Available' || !startTime) {
    return TooltipMessageSeverity.Info;
  }

  const withinGracePeriod = isBefore(
    Date.now(),
    addMilliseconds(toMillis(forgivenessPeriod), toMillis(startTime))
  );

  return withinGracePeriod
    ? TooltipMessageSeverity.Positive
    : TooltipMessageSeverity.Warning;
};
