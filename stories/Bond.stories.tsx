import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Bond, BondProps } from 'components/Bond';

export default {
  title: 'components/Bond',
  component: Bond,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey' }}>{story()}</div>
    ),
  ],
} as Meta;

export const Template: Story<BondProps> = args => <Bond {...args} />;

Template.storyName = 'Bond';
Template.args = {
  value: 0.3,
  token: 'NEAR',
};
