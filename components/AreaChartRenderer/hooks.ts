import {
  ChartDataElement,
  DomainControl,
  Range,
} from 'components/AreaChartRenderer/types';
import { useCallback, useState } from 'react';
import {
  DOMAIN_RANGES,
  prepareDataByRange,
} from 'components/AreaChartRenderer/helpers';

export const useDomainControl = (
  data: ChartDataElement[],
  initialRange?: Range
): DomainControl => {
  const [dataByRange, setDataByRange] = useState(() => {
    return prepareDataByRange(initialRange || DOMAIN_RANGES.DAY, data);
  });

  const [activeRange, setActiveRange] = useState<Range>(
    initialRange || DOMAIN_RANGES.DAY
  );

  const toggleDomain = useCallback(
    (range: Range) => {
      if (!data.length || data.length === 1) {
        return;
      }

      const newData = prepareDataByRange(range, data);

      setActiveRange(range);
      setDataByRange(newData);
    },
    [data]
  );

  return {
    activeRange,
    toggleDomain,
    data: dataByRange,
  };
};
