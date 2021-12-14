import React, { FC, useState } from 'react';
import Measure from 'react-measure';
import { LineChart, Line } from 'recharts';

import { ChartDataElement } from 'components/AreaChartRenderer/types';
import { useDomainControl } from 'components/AreaChartRenderer/hooks';
import { DOMAIN_RANGES } from 'components/AreaChartRenderer/helpers';

import styles from './StatChart.module.scss';

interface StatChartProps {
  data: ChartDataElement[];
}

export const StatChart: FC<StatChartProps> = ({ data }) => {
  const [width, setWidth] = useState(0);

  const { data: chartData } = useDomainControl(data || [], DOMAIN_RANGES.ALL);

  if (!chartData.length) {
    return null;
  }

  return (
    <Measure
      onResize={contentRect => {
        const newWidth = contentRect?.entry?.width;

        if (width !== newWidth) {
          setWidth(newWidth / 2);
        }
      }}
    >
      {({ measureRef }) => (
        <div className={styles.root} ref={measureRef}>
          <LineChart width={width} height={34} data={chartData}>
            <Line
              strokeWidth={2}
              dot={false}
              dataKey="y"
              type="monotone"
              stroke="#6038d0"
            />
          </LineChart>
        </div>
      )}
    </Measure>
  );
};
