import React, { ReactNode } from 'react';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useMedia } from 'react-use';

import { ChartTooltip } from 'components/AreaChartRenderer/components/ChartTooltip';
import {
  tickXFormatter,
  getXInterval,
} from 'components/AreaChartRenderer/helpers';
import {
  LineDataPoint,
  Payload,
  Range,
} from 'components/AreaChartRenderer/types';
import { UnitPosition } from 'types/stats';

import { kFormatter } from 'utils/format';

export type TLineAxis = 'left' | 'right';

type LineItem = {
  name: string;
  color: string;
  dataKey: string;
  gradient: string;
  lineAxis: TLineAxis;
};

interface ChartProps {
  width?: number;
  height?: number;
  lines?: LineItem[];
  data: LineDataPoint[] | undefined;
  period: Range;
  isIntegerDataset?: boolean;
  unit?: string | ReactNode;
  unitPosition?: UnitPosition;
}

const tickStyles = {
  fill: '#969696',
  fontWeight: 400,
  fontSize: '10px',
  lineHeight: '20px',
};

const COLORS = {
  GRID: '#d9d9d9',
  AXIS: '#281f1f',
  AREA: '#6038d0',
  AREA2: '#6038d0',
  TOOLTIP: '#c1b0f1',
};

export const Chart: React.FC<ChartProps> = ({
  lines = [],
  data = [],
  width = 685,
  height = 340,
  period,
  isIntegerDataset = false,
  unit = '',
  unitPosition = 'left',
}) => {
  const isMobile = useMedia('(max-width: 768px)');
  const renderActiveDot = ({
    cx,
    cy,
    fill,
  }: {
    cx: number;
    cy: number;
    fill: string;
  }) => (
    <g>
      <line
        x1={35}
        y1={cy}
        x2={width - 10}
        y2={cy}
        stroke="#686767"
        strokeWidth="0.5"
        strokeDasharray="5,5"
      />
      <circle
        cx={cx}
        cy={cy}
        r={4}
        strokeWidth={8}
        fill={fill}
        stroke={fill}
        strokeOpacity={0.5}
      />
    </g>
  );

  return (
    <AreaChart
      width={width}
      height={height}
      data={data}
      margin={{ top: 5, left: -22, right: 8, bottom: 5 }}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#6038d0" stopOpacity={0.45} />
          <stop offset="40%" stopColor="#6038d0" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#8884d8" stopOpacity={0.085} />
        </linearGradient>
        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#19D992" stopOpacity={0.45} />
          <stop offset="40%" stopColor="#19D992" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#19D992" stopOpacity={0.085} />
        </linearGradient>
      </defs>
      <CartesianGrid stroke={COLORS.GRID} vertical={false} />
      {lines.map(filterLine => {
        const max = Math.max.apply(
          null,
          (data as unknown as Record<string, number>[]).map(
            entry => entry[filterLine.dataKey]
          )
        );

        return (
          <YAxis
            key={filterLine.lineAxis}
            yAxisId={filterLine.lineAxis}
            type="number"
            stroke={filterLine.color}
            domain={[0, max !== 0 ? max + max * 0.1 : 4]}
            tickMargin={1}
            interval={0}
            orientation={filterLine.lineAxis}
            tickLine={false}
            tickFormatter={value => kFormatter(value, isIntegerDataset ? 0 : 1)}
            style={tickStyles}
          />
        );
      })}
      <XAxis
        interval={getXInterval(data || [], period, isMobile)}
        stroke={COLORS.AXIS}
        dataKey="x"
        tickMargin={12}
        tickCount={2}
        tickLine={false}
        tickFormatter={value => tickXFormatter(value, period)}
        style={tickStyles}
        minTickGap={5}
      />
      {lines.map(filterLine => (
        <Area
          strokeWidth={2}
          dot={false}
          yAxisId={filterLine.lineAxis}
          dataKey={filterLine.dataKey}
          type="monotone"
          stroke={filterLine.color}
          fillOpacity={1}
          fill={`url(#${filterLine.gradient})`}
          key={filterLine.name}
          activeDot={renderActiveDot}
        />
      ))}
      <Tooltip
        content={({ active, payload, label, viewBox, coordinate, offset }) => (
          <ChartTooltip
            unit={unit}
            unitPosition={unitPosition}
            active={active}
            payload={payload as Payload[]}
            label={label}
            viewBox={viewBox}
            coordinate={coordinate}
            offset={offset}
            isIntegerDataset={isIntegerDataset}
          />
        )}
        cursor={{
          stroke: COLORS.TOOLTIP,
          strokeWidth: '0.5',
          strokeDasharray: '5,5',
        }}
      />
    </AreaChart>
  );
};
