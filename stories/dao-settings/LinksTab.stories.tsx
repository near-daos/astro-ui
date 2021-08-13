import React from 'react';

import { Meta, Story } from '@storybook/react';

import LinksTab, {
  LinksTabProps
} from 'features/dao-settings/components/links-tab/LinksTab';

export default {
  title: 'Features/DAO Settings/LinksTab',
  component: LinksTab
} as Meta;

export const Template: Story<LinksTabProps> = (args): JSX.Element => (
  <LinksTab {...args} />
);

Template.storyName = 'LinksTab';

Template.args = {
  links: [
    {
      id: '1',
      url: 'http://example.com'
    },
    {
      id: '2',
      url: 'http://discord.com/meowsers/join'
    },
    {
      id: '3',
      url: 'https://twitter.com/meowsers/join'
    }
  ]
};
