import Decimal from 'decimal.js';
import { YOKTO_NEAR } from 'services/sputnik/constants';
import {
  addHours,
  format,
  formatDuration,
  millisecondsToMinutes,
  minutesToHours,
} from 'date-fns';

export function formatYoktoValue(value: string, divider?: number): string {
  if (!value) {
    return '0';
  }

  const dividerValue = divider ? 10 ** divider : YOKTO_NEAR;

  const amountYokto = new Decimal(value);

  return Number(amountYokto.div(dividerValue).toFixed(4)).toString();
}

export const toHoursAndFormat = (
  duration: string,
  toString: (hours: number) => string
): string => {
  const millis = Number(duration) / 1000000;
  const minutes = millisecondsToMinutes(millis);
  const hours = minutesToHours(minutes);

  return toString(hours);
};

export const formatForgivenessDuration = (
  forgivenessDuration: string
): string => {
  return toHoursAndFormat(forgivenessDuration, hours =>
    formatDuration({ hours })
  );
};

export const formatDeadlineDate = (deadlineDuration: string): string => {
  return toHoursAndFormat(deadlineDuration, hours => {
    const deadline: Date = addHours(new Date(), hours);

    return `${format(deadline, 'dd.LL.yyyy')} at ${format(
      deadline,
      'hh:mm z'
    )}`;
  });
};

export const formatTimestampAsDate = (time: string): string => {
  const date = new Date(Number(time) / 1000000);

  return format(date, 'dd LLL yyyy hh:mm:ss');
};
