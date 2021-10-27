import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  RecentlyUnstaked,
  RecentlyUnstakedProps,
} from 'features/voting-token/components/recently-unstaked';

export default {
  title: 'Features/VotingToken/RecentlyUnstaked',
  component: RecentlyUnstaked,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: '#e5e5e5', maxWidth: 1024 }}>
        {story()}
      </div>
    ),
  ],
} as Meta;

export const Template: Story<RecentlyUnstakedProps> = (args): JSX.Element => (
  <RecentlyUnstaked {...args} />
);

Template.storyName = 'RecentlyUnstaked';
Template.args = {
  stakes: [
    {
      id: '1',
      amount: 222,
      name: 'GOOSE',
    },
    {
      id: '2',
      amount: 234,
      name: 'MOON',
    },
  ],
};
