import { useCallback, useEffect, useState } from 'react';
import { subHours, subDays, subMonths, subYears } from 'date-fns';
import { ChartDataElement, DomainControl, Domain } from './types';

export const DOMAIN_RANGES = {
  DAY: 'DAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH',
  YEAR: 'YEAR',
  ALL: 'ALL',
};

function getDomain(
  data: ChartDataElement[],
  activeRange: string
): [Date, Date] {
  if (!data.length) {
    return [new Date(), new Date()];
  }

  let start;
  let end;

  if (data.length === 1) {
    end = data[data.length - 1].x;

    switch (activeRange) {
      case DOMAIN_RANGES.DAY: {
        start = subHours(end, 24);
        break;
      }
      case DOMAIN_RANGES.WEEK: {
        start = subDays(end, 7);
        break;
      }
      case DOMAIN_RANGES.MONTH: {
        start = subMonths(end, 1);
        break;
      }
      case DOMAIN_RANGES.YEAR: {
        start = subYears(end, 1);
        break;
      }
      case DOMAIN_RANGES.ALL:
      default: {
        start = subYears(end, 1);
        break;
      }
    }
  } else {
    start = data[0].x;
    end = data[data.length - 1].x;
  }

  return [start, end];
}

function getPreparedStartEndDates(
  startDate: Date,
  endDate: Date,
  data: ChartDataElement[]
) {
  let start = startDate;
  const end = endDate;
  const closestElement = data.find(item => item.x >= start);

  if (closestElement?.x && closestElement?.x !== end) {
    start = closestElement?.x;
  }

  return [start, end];
}

export const useDomainControl = (data: ChartDataElement[]): DomainControl => {
  const [activeRange, setActiveRange] = useState(DOMAIN_RANGES.DAY);
  const [maxDomainValue, setMaxDomainValue] = useState(0);

  const [domain, setDomain] = useState<{ x?: Domain; y?: Domain }>({
    x: getDomain(data, activeRange),
  });

  const yValues = data.map(item => item.y);
  const maxValue = Math.max(...yValues);
  const minValue = Math.min(...yValues);
  const verticalDomain: [number, number] = [minValue, maxValue];

  const toggleDomain = useCallback(
    (range: string) => {
      if (!data.length || data.length === 1) return;

      setActiveRange(range);

      switch (range) {
        case DOMAIN_RANGES.DAY: {
          const endDate = data[data.length - 1].x;
          const startDate = subHours(endDate, 24);
          const [start, end] = getPreparedStartEndDates(
            startDate,
            endDate,
            data
          );

          setDomain({
            x: [start, end],
          });
          break;
        }
        case DOMAIN_RANGES.WEEK: {
          const endDate = data[data.length - 1].x;
          const startDate = subDays(endDate, 7);
          const [start, end] = getPreparedStartEndDates(
            startDate,
            endDate,
            data
          );

          setDomain({
            x: [start, end],
          });
          break;
        }
        case DOMAIN_RANGES.MONTH: {
          const endDate = data[data.length - 1].x;
          const startDate = subMonths(endDate, 1);
          const [start, end] = getPreparedStartEndDates(
            startDate,
            endDate,
            data
          );

          setDomain({
            x: [start, end],
          });
          break;
        }
        case DOMAIN_RANGES.YEAR: {
          const endDate = data[data.length - 1].x;
          const startDate = subYears(endDate, 1);
          const [start, end] = getPreparedStartEndDates(
            startDate,
            endDate,
            data
          );

          setDomain({
            x: [start, end],
          });
          break;
        }
        default:
        case DOMAIN_RANGES.ALL: {
          setDomain({
            x: [data[0].x, data[data.length - 1].x],
          });
          break;
        }
      }
    },
    [data]
  );

  const onZoomDataChange = useCallback(() => {
    const filteredData = data.filter(item => {
      if (!domain || !domain.x) return false;

      return item.x >= domain.x[0] && item.x <= domain?.x[1];
    });

    if (filteredData?.length) {
      setMaxDomainValue(filteredData[filteredData.length - 1].y);
    }
  }, [domain, data]);

  useEffect(() => {
    toggleDomain(DOMAIN_RANGES.DAY);
  }, [toggleDomain]);

  useEffect(() => {
    onZoomDataChange();
  }, [activeRange, onZoomDataChange]);

  return {
    domain,
    toggleDomain,
    activeRange,
    verticalDomain,
    onZoomDataChange,
    maxDomainValue,
  };
};
