import React from 'react';
import { Meta, Story } from '@storybook/react';
import { AppHeader, AppHeaderProps } from 'features/app-header';

export default {
  title: 'features/AppHeader',
  component: AppHeader
} as Meta;

export const Template: Story<AppHeaderProps> = (args): JSX.Element => (
  <AppHeader {...args} />
);

Template.storyName = 'AppHeader';
Template.args = {
  isLandingPage: false
};
