import { formatDistance } from 'date-fns';

export const nanosToDays = (nanos: string): string[] => {
  const millis = Math.round(Number(nanos) / 1000000);

  return formatDistance(millis, 0, { addSuffix: false }).split(' ');
};
