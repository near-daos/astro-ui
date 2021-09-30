import { Meta, Story } from '@storybook/react';

import LinksTab, {
  LinksTabProps
} from 'features/dao-settings/components/links-tab/LinksTab';
import React from 'react';

export default {
  title: 'Features/DAO Settings/LinksTab',
  component: LinksTab
} as Meta;

export const Template: Story<LinksTabProps> = (args): JSX.Element => (
  <LinksTab {...args} />
);

Template.storyName = 'LinksTab';

Template.args = {};
