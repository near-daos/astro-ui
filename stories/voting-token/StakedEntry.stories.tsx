import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  StakedEntry,
  StakedEntryProps,
} from 'features/voting-token/components/staked-entry';
import { Button } from 'components/button/Button';

export default {
  title: 'Features/VotingToken/StakedEntry',
  component: StakedEntry,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: '#e5e5e5', maxWidth: 1024 }}>
        {story()}
      </div>
    ),
  ],
} as Meta;

export const Template: Story<StakedEntryProps> = (args): JSX.Element => (
  <StakedEntry {...args} />
);

Template.storyName = 'StakedEntry';
Template.args = {
  amount: 222,
  name: 'GOOSE',
  delegatedTo: 'annie.near',
  children: <Button variant="secondary">Change</Button>,
};
