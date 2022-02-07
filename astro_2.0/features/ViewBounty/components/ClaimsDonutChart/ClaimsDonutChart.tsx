import React, { FC } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

interface ClaimsDonutChartProps {
  data: {
    status: string;
    value: number;
  }[];
}

const COLORS = {
  approved: '#19d992',
  pending: '#4d96d7',
  inProgress: '#6038d0',
  rejected: '#c14600',
} as Record<string, string>;

export const ClaimsDonutChart: FC<ClaimsDonutChartProps> = ({ data }) => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fontSize={12}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div>
      <PieChart width={120} height={120}>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={60}
          innerRadius={24}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {data.map(entry => (
            <Cell key={`cell-${entry.status}`} fill={COLORS[entry.status]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
};
