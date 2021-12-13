import React from 'react';
import AreaChart, { AreaChartProps } from 'components/AreaChartRenderer';
import { Meta, Story } from '@storybook/react';
import { addHours } from 'date-fns';

export default {
  title: 'Components/AreaChart',
  component: AreaChart,
  decorators: [
    story => (
      <div style={{ padding: '1rem', maxWidth: '900px' }}>{story()}</div>
    ),
  ],
} as Meta;

function getRandomAmount(initial: number) {
  const mod = Math.random() * 1000;

  const minValue = initial - mod < 0 ? 0 : initial - mod;

  return Math.random() > 0.9 ? minValue : initial + mod;
}

function generateData() {
  const startDate = new Date(2019, 1, 1);
  const RETURNS = [];

  for (let i = 0; i < 1000; i += 3) {
    RETURNS.push({
      timestamp: addHours(startDate, i).getTime(),
      balance: getRandomAmount(0),
    });
  }

  return RETURNS;
}

export const Template: Story<AreaChartProps> = (
  args: React.ComponentProps<typeof AreaChart>
): JSX.Element => (
  <>
    <AreaChart {...args} />
  </>
);

Template.storyName = 'AreaChart';
Template.args = {
  data: generateData(),
};
