import { formatDistance } from 'date-fns';

export const toMillis = (timePeriod: string): number =>
  Math.round(Number(timePeriod) / 1000000);

export const getDistance = (timePeriod: string): string[] => {
  const distance = formatDistance(
    toMillis(timePeriod),
    new Date().getMilliseconds(),
    {
      addSuffix: true,
    }
  );

  return distance.split(' ');
};
