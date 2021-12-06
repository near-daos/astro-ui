import React, { FC, useMemo, useState } from 'react';
import Measure from 'react-measure';
import { VictoryChart, VictoryAxis, createContainer } from 'victory';
import { VictoryArea } from 'victory-area';

import styles from './AreaChart.module.scss';
import RangeToggle from './components/range-toggle/RangeToggle';

import CustomPoint from './components/custom-point';

import { useDomainControl } from './helpers';
import {
  BOTTOM_AXIS_STYLES,
  LEFT_AXIS_STYLES,
  LINE_STYLES,
} from './chart-styles';

export interface AreaChartProps {
  data: { timestamp: number; balance: number }[] | undefined;
  symbol: string;
}

// eslint-disable-next-line
const VictoryZoomVoronoiContainer: any = createContainer('zoom', 'voronoi');

export const AreaChart: FC<AreaChartProps> = ({ symbol, data = [] }) => {
  const preparedData = useMemo(
    () =>
      data.map(item => ({
        x: new Date(item.timestamp),
        y: item.balance,
      })),
    [data]
  );

  const [width, setWidth] = useState(0);
  const {
    domain,
    toggleDomain,
    activeRange,
    verticalDomain,
  } = useDomainControl(preparedData || []);

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
            <RangeToggle onClick={toggleDomain} activeRange={activeRange} />
          </div>
          <svg style={{ height: 0 }}>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6038D0" stopOpacity="0.4" />
                <stop offset="15%" stopColor="#6038D0" stopOpacity="0.35" />
                <stop offset="70%" stopColor="#6038D0" stopOpacity="0.1" />
                <stop offset="90%" stopColor="#6038D0" stopOpacity="0.05" />
                <stop offset="9%" stopColor="#6038D0" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#6038D0" stopOpacity="0.025" />
              </linearGradient>
            </defs>
          </svg>
          <div className={styles.chartWrapper}>
            <VictoryChart
              padding={{ top: 24, bottom: 24, left: 64, right: 12 }}
              width={width}
              height={284}
              domainPadding={{ x: 100 }}
              scale={{ x: 'time' }}
              containerComponent={
                <VictoryZoomVoronoiContainer
                  allowZoom={false}
                  allowPan={false}
                  constrainToVisibleArea
                  responsive={false}
                  zoomDimension="x"
                  labels={() => ' '}
                  labelComponent={<CustomPoint symbol={symbol} />}
                  zoomDomain={domain}
                />
              }
            >
              <VictoryAxis
                orientation="bottom"
                style={BOTTOM_AXIS_STYLES}
                scale="time"
              />
              <VictoryAxis
                dependentAxis
                domain={{ y: verticalDomain }}
                orientation="left"
                // offsetX={60}
                style={LEFT_AXIS_STYLES}
                tickFormat={d => `${d.toLocaleString()}`}
              />
              <VictoryArea
                style={LINE_STYLES}
                data={preparedData}
                animate={{
                  duration: 500,
                  onLoad: { duration: 1000 },
                }}
              />
            </VictoryChart>
          </div>
        </div>
      )}
    </Measure>
  );
};
