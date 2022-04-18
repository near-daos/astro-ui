import { subDays, format, subHours } from 'date-fns';
import { LineDataPoint, Range } from './types';

export const DOMAIN_RANGES: Record<string, Range> = {
  DAY: 'DAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH',
  THREE_MONTHS: 'THREE_MONTHS',
  SIX_MONTHS: 'SIX_MONTHS',
  YEAR: 'YEAR',
  ALL: 'ALL',
};

function buildDataMap(data: LineDataPoint[], keyFormat: string) {
  return data.reduce<Record<string, LineDataPoint>>((res, item) => {
    const d = format(item.x, keyFormat);

    if (!res[d]) {
      res[d] = item;
    }

    return res;
  }, {});
}

export function prepareDataByRange(
  range: Range,
  rawData: LineDataPoint[]
): LineDataPoint[] {
  if (!rawData || !rawData.length) {
    return [];
  }

  // first data point
  const start = rawData[0];

  // reverse data - we would like to build curve from now
  const data = rawData.slice().reverse();

  // Number of points on X axis
  let numberOfElements;

  // dataMap key format
  let keyFormat: string;

  // datetime function
  let func: (date: Date | number, amount: number) => Date;

  switch (range) {
    case DOMAIN_RANGES.DAY: {
      numberOfElements = 24;
      keyFormat = 'dd_LLL_yyyy_HH';
      func = subHours;
      break;
    }
    case DOMAIN_RANGES.WEEK: {
      numberOfElements = 7;
      keyFormat = 'dd_LLL_yyyy';
      func = subDays;
      break;
    }
    case DOMAIN_RANGES.MONTH: {
      numberOfElements = 30;
      keyFormat = 'dd_LLL_yyyy';
      func = subDays;
      break;
    }
    case DOMAIN_RANGES.THREE_MONTHS: {
      numberOfElements = 90;
      keyFormat = 'dd_LLL_yyyy';
      func = subDays;
      break;
    }
    case DOMAIN_RANGES.SIX_MONTHS: {
      numberOfElements = 180;
      keyFormat = 'dd_LLL_yyyy';
      func = subDays;
      break;
    }
    case DOMAIN_RANGES.YEAR: {
      numberOfElements = 365;
      keyFormat = 'dd_LLL_yyyy';
      func = subDays;
      break;
    }
    default: {
      numberOfElements = rawData.length > 365 ? rawData.length : 365;
      keyFormat = 'dd_LLL_yyyy';
      func = subDays;
    }
  }

  // Reference map that accumulates known data points
  const dataMap = buildDataMap(data, keyFormat);

  // Current datetime
  const now = new Date();

  // Pre-populate result data array
  const result = new Array(numberOfElements).fill(null);

  // Temp variable to keep last known value
  let prev = rawData[rawData.length - 1].y;
  let prev2 = rawData[rawData.length - 1].y2;

  return result
    .map((item, i) => {
      const date = func(now, i);
      const key = format(date, keyFormat);

      if (dataMap[key]) {
        prev = dataMap[key].y;
        prev2 = dataMap[key].y2;

        return {
          x: date,
          y: dataMap[key].y,
          y2: dataMap[key].y2,
        };
      }

      return {
        x: date,
        y: prev,
        y2: prev2,
      };
    })
    .reverse()
    .filter(item => item.x >= start.x);
}

export const valueFormatter = (value: number): string => {
  if (value === 0) {
    return '0';
  }

  if (value >= 1000) {
    return `${value % 1000}M`;
  }

  return `${value}K`;
};

export const getXInterval = (
  data: LineDataPoint[],
  period: Range,
  isMobile: boolean
): number | undefined => {
  if (isMobile) {
    return undefined;
  }

  const timestamps = data.map(item => item.x);

  switch (period) {
    case DOMAIN_RANGES.ALL:
      return Math.floor(timestamps.length / 6);
    case DOMAIN_RANGES.YEAR:
      return Math.floor(timestamps.length / 12);
    case DOMAIN_RANGES.MONTH:
    case DOMAIN_RANGES.THREE_MONTHS:
    case DOMAIN_RANGES.SIX_MONTHS:
      return Math.floor(timestamps.length / 10);
    case DOMAIN_RANGES.WEEK:
      return 1;
    default:
      return 1;
  }
};

export const tickXFormatter = (
  value: number | string,
  period: Range
): string => {
  if (value === 'auto') {
    return 'auto';
  }

  switch (period) {
    case DOMAIN_RANGES.ALL:
    case DOMAIN_RANGES.YEAR:
    case DOMAIN_RANGES.MONTH:
    case DOMAIN_RANGES.THREE_MONTHS:
    case DOMAIN_RANGES.SIX_MONTHS:
    case DOMAIN_RANGES.WEEK:
      return format(new Date(value), 'd LLL');
    case DOMAIN_RANGES.DAY:
    default:
      return format(new Date(value), 'HH:mm');
  }
};
