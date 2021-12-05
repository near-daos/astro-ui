import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  PluginCard,
  PluginCardProps,
} from 'astro_2.0/features/pages/plugins/PluginCard';

export default {
  title: 'Features/Plugins/Cards/PluginCard',
  component: PluginCard,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey', maxWidth: 1024 }}>
        {story()}
      </div>
    ),
  ],
} as Meta;

export const Template: Story<PluginCardProps> = (args): JSX.Element => (
  <PluginCard {...args} />
);

Template.storyName = 'UsePluginPopup';
Template.args = {
  tokenName: 'tkn.near',
  functionName: 'FunctionName',
  created: '2021-02-07',
};
