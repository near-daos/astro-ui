import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  AmountsStaked,
  AmountsStakedProps,
} from 'features/voting-token/components/amounts-staked';

export default {
  title: 'Features/VotingToken/AmountsStaked',
  component: AmountsStaked,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: '#e5e5e5', maxWidth: 1024 }}>
        {story()}
      </div>
    ),
  ],
} as Meta;

export const Template: Story<AmountsStakedProps> = (args): JSX.Element => (
  <AmountsStaked {...args} />
);

Template.storyName = 'AmountsStaked';
Template.args = {
  stakes: [
    {
      id: '1',
      amount: 222,
      name: 'GOOSE',
      delegatedTo: 'annie.near',
    },
    {
      id: '2',
      amount: 234,
      name: 'MOON',
      delegatedTo: 'john.near',
    },
  ],
};
