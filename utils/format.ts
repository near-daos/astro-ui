import Decimal from 'decimal.js';
import { format, formatDistance } from 'date-fns';

import { YOKTO_NEAR } from 'services/sputnik/constants';
import { DATE_TIME_FORMAT } from 'constants/timeConstants';
import BN from 'bn.js';

export const toMillis = (timePeriod: string): number =>
  Math.round(Number(timePeriod) / 1000000);

export const getDistanceFromNow = (timePeriod: string): string => {
  return formatDistance(new Date(toMillis(timePeriod)), 0, {
    addSuffix: false,
  });
};

export function formatYoktoValue(value: string, divider?: number): string {
  if (!value) {
    return '0';
  }

  const dividerValue = divider ? 10 ** divider : YOKTO_NEAR;

  const amountYokto = new Decimal(value);

  return Number(amountYokto.div(dividerValue).toFixed(4)).toString();
}

export const formatTimestampAsDate = (time: string): string => {
  const date = new Date(Number(time) / 1000000);

  return format(date, DATE_TIME_FORMAT);
};

export function kFormatter(n: number, toFixed = 0): string {
  if (n === undefined) {
    return '0';
  }

  if (n >= 1000000000) {
    return `${(n / 1000000000).toFixed(1).replace(/\.0$/, '')}G`;
  }

  if (n >= 1000000) {
    return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }

  if (n >= 1000) {
    return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }

  return n % 1 !== 0 ? `${n.toFixed(toFixed)}` : n.toFixed();
}

export function shortenString(value: string, maxLength: number): string {
  if (!value) {
    return '';
  }

  if (value.length <= maxLength || value.length < 20) {
    return value;
  }

  const suffix = value.substring(value.length - 5, value.length);

  const prefix = value.substring(0, maxLength - 4);

  return `${prefix}...${suffix}`;
}

export function formatGasValue(gas: string | number): BN {
  return new BN(Number(gas) * 10 ** 12);
}
