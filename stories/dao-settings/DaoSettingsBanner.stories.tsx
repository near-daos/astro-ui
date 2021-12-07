import { Meta, Story } from '@storybook/react';
import {
  DaoSettingsBanner,
  DaoSettingsBannerProps,
} from 'features/vote-policy/components/DaoSettingsBanner';
import React from 'react';

export default {
  title: 'Features/Dao Settings/DaoSettingsBanner',
  component: DaoSettingsBanner,
} as Meta;

export const Template: Story<DaoSettingsBannerProps> = (args): JSX.Element => (
  <DaoSettingsBanner {...args} />
);

Template.storyName = 'DaoSettingsBanner';

Template.args = {};
