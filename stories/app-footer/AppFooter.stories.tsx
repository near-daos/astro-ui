import React from 'react';
import { Meta, Story } from '@storybook/react';
import { AppFooter, AppFooterProps } from 'features/AppFooter';

export default {
  title: 'features/AppFooter',
  component: AppFooter,
} as Meta;

export const Template: Story<AppFooterProps> = (args): JSX.Element => (
  <AppFooter {...args} />
);

Template.storyName = 'AppFooter';
Template.args = {
  mobile: true,
};
