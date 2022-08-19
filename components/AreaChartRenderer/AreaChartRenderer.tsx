import React, { FC, useMemo, useState } from 'react';
import Measure from 'react-measure';

import { Chart } from 'components/AreaChartRenderer/components/Chart';

import styles from './AreaChart.module.scss';

import RangeToggle from './components/range-toggle/RangeToggle';

import { useDomainControl } from './hooks';
import { Range } from './types';

export interface AreaChartProps {
  data: { timestamp: number; balance: number; tooltip?: string }[] | undefined;
  range?: Range;
  tokenName: string;
}

export const AreaChartRenderer: FC<AreaChartProps> = ({
  range,
  tokenName,
  data = [],
}) => {
  const preparedData = useMemo(
    () =>
      data.map(item => ({
        x: new Date(item.timestamp),
        y: item.balance,
        tooltip: item.tooltip,
      })),
    [data]
  );

  const [width, setWidth] = useState(0);
  const {
    data: chartData,
    toggleDomain,
    activeRange,
  } = useDomainControl(preparedData || [], range);

  if (!preparedData.length) {
    return null;
  }

  return (
    <Measure
      onResize={contentRect => {
        const newWidth = contentRect?.entry?.width;

        if (width !== newWidth) {
          setWidth(newWidth);
        }
      }}
    >
      {({ measureRef }) => (
        <div className={styles.root} ref={measureRef}>
          <div className={styles.header}>
            <div className={styles.title}>TVL Over Time</div>
            {!range ? (
              <RangeToggle
                onClick={toggleDomain}
                activeRange={activeRange}
                className={styles.range}
              />
            ) : (
              <div className={styles.rangePlaceholder}>
                Last {range.toLowerCase()}
              </div>
            )}
          </div>
          <div className={styles.chartWrapper}>
            <Chart
              width={width}
              data={chartData}
              period={activeRange}
              unit={tokenName}
              unitPosition="right"
              lines={[
                {
                  name: 'tvl',
                  color: 'red',
                  dataKey: 'y',
                  gradient: 'colorUv',
                  lineAxis: 'left',
                },
              ]}
            />
          </div>
        </div>
      )}
    </Measure>
  );
};
