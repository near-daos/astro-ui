import React, { FC, useState } from 'react';
import Measure from 'react-measure';
import { LineChart, Line, YAxis } from 'recharts';

import { ChartDataElement } from 'components/AreaChartRenderer/types';
import { useDomainControl } from 'components/AreaChartRenderer/hooks';
import { DOMAIN_RANGES } from 'components/AreaChartRenderer/helpers';

import styles from './StatChart.module.scss';

interface StatChartProps {
  data: ChartDataElement[];
}

export const StatChart: FC<StatChartProps> = ({ data }) => {
  const [width, setWidth] = useState(0);

  const { data: chartData } = useDomainControl(
    data.sort((a, b) => {
      if (a.x > b.x) {
        return 1;
      }

      if (a.x < b.x) {
        return -1;
      }

      return 0;
    }) || [],
    DOMAIN_RANGES.ALL
  );

  if (!chartData.length) {
    return null;
  }

  const max = Math.max.apply(
    null,
    chartData.map(entry => entry.y)
  );

  return (
    <Measure
      onResize={contentRect => {
        const newWidth = contentRect?.entry?.width;

        if (width !== newWidth) {
          setWidth(newWidth - newWidth * 0.15);
        }
      }}
    >
      {({ measureRef }) => (
        <div className={styles.root} ref={measureRef}>
          <LineChart width={width} height={34} data={chartData}>
            <YAxis
              width={0}
              type="number"
              stroke="#ddd"
              domain={[0, max + max * 0.1]}
              tickMargin={1}
              interval={0}
              tickCount={0}
              tickLine={false}
            />
            <Line
              strokeWidth={2}
              dot={false}
              dataKey="y"
              type="monotone"
              stroke="#6038d0"
              isAnimationActive={false}
            />
          </LineChart>
        </div>
      )}
    </Measure>
  );
};
