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

function getDomain(data: ChartDataElement[]): [Date, Date] {
  if (!data.length) {
    return [new Date(), new Date()];
  }

  const start = subHours(data[data.length - 1].x, 24);
  const end = data[data.length - 1].x;

  return [start, end];
}

export const useDomainControl = (data: ChartDataElement[]): DomainControl => {
  const [domain, setDomain] = useState<{ x?: Domain; y?: Domain }>({
    x: getDomain(data),
  });
  const [activeRange, setActiveRange] = useState(DOMAIN_RANGES.DAY);
  const [maxDomainValue, setMaxDomainValue] = useState(0);

  const yValues = data.map(item => item.y);
  const maxValue = Math.max(...yValues);
  const minValue = Math.min(...yValues);
  const verticalDomain: [number, number] = [minValue, maxValue];

  const toggleDomain = useCallback(
    (range: string) => {
      if (!data.length) return;

      setActiveRange(range);

      switch (range) {
        case DOMAIN_RANGES.DAY: {
          setDomain({
            x: [subHours(data[data.length - 1].x, 24), data[data.length - 1].x],
          });
          break;
        }
        case DOMAIN_RANGES.WEEK: {
          setDomain({
            x: [subDays(data[data.length - 1].x, 7), data[data.length - 1].x],
          });
          break;
        }
        case DOMAIN_RANGES.MONTH: {
          setDomain({
            x: [subMonths(data[data.length - 1].x, 1), data[data.length - 1].x],
          });
          break;
        }
        case DOMAIN_RANGES.YEAR: {
          setDomain({
            x: [subYears(data[data.length - 1].x, 1), data[data.length - 1].x],
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
