import React from 'react';

import { Meta, Story } from '@storybook/react';
import {
  DaoSettingsBanner,
  DaoSettingsBannerProps
} from 'features/dao-settings/components/dao-settings-banner';

export default {
  title: 'Features/Dao Settings/DaoSettingsBanner',
  component: DaoSettingsBanner
} as Meta;

export const Template: Story<DaoSettingsBannerProps> = (args): JSX.Element => (
  <DaoSettingsBanner {...args} />
);

Template.storyName = 'DaoSettingsBanner';

Template.args = {};
