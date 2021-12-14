import React from 'react';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

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
import { useMedia } from 'react-use';

type LineItem = {
  name: string;
  color: string;
  dataKey: string;
};

interface ChartProps {
  width?: number;
  height?: number;
  lines?: LineItem[];
  data: LineDataPoint[] | undefined;
  period: Range;
  tokenName: string;
}

const tickStyles = {
  fill: '#969696',
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '20px',
};

const COLORS = {
  GRID: '#d9d9d9',
  AXIS: '#281f1f',
  AREA: '#6038d0',
  TOOLTIP: '#c1b0f1',
};

export const Chart: React.FC<ChartProps> = ({
  lines = [],
  data = [],
  width = 685,
  height = 340,
  period,
  tokenName,
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
        x1={65}
        y1={cy}
        x2={width}
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

  const max = Math.max.apply(
    null,
    data.map(entry => entry.y)
  );

  return (
    <AreaChart width={width} height={height} data={data}>
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
          <stop offset="130%" stopColor="#8884d8" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid stroke={COLORS.GRID} vertical={false} />
      <YAxis
        type="number"
        stroke={COLORS.AXIS}
        domain={[0, max + max * 0.1]}
        tickMargin={1}
        interval={0}
        tickLine={false}
        style={tickStyles}
      />
      <XAxis
        interval={isMobile ? 3 : getXInterval(data || [], period)}
        stroke={COLORS.AXIS}
        dataKey="x"
        tickMargin={12}
        tickCount={6}
        tickLine={false}
        tickFormatter={value => tickXFormatter(value, period)}
        style={tickStyles}
        minTickGap={5}
      />
      {lines.map(filterLine => (
        <Area
          strokeWidth={2}
          dot={false}
          dataKey={filterLine.dataKey}
          type="monotone"
          stroke={COLORS.AREA}
          fillOpacity={1}
          fill="url(#colorUv)"
          key={filterLine.name}
          activeDot={renderActiveDot}
        />
      ))}
      <Tooltip
        content={({ active, payload, label, viewBox, coordinate, offset }) => (
          <ChartTooltip
            dataType={tokenName}
            active={active}
            payload={payload as Payload[]}
            label={label}
            viewBox={viewBox}
            coordinate={coordinate}
            offset={offset}
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
