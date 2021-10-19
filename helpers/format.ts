import Decimal from 'decimal.js';
import { YOKTO_NEAR } from 'services/sputnik/constants';
import {
  addHours,
  format,
  formatDuration,
  millisecondsToMinutes,
  minutesToHours
} from 'date-fns';

export function formatYoktoValue(value: string, divider = YOKTO_NEAR): string {
  const amountYokto = new Decimal(value);

  return Number(amountYokto.div(divider).toFixed(5)).toString();
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
