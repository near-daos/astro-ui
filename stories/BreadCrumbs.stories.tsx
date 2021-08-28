import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  BreadCrumbs,
  BreadCrumbsProps
} from 'components/breadcrumbs/BreadCrumbs';

export default {
  title: 'components/BreadCrumbs',
  component: BreadCrumbs,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey' }}>{story()}</div>
    )
  ]
} as Meta;

export const Template: Story<BreadCrumbsProps> = (args): JSX.Element => (
  <BreadCrumbs {...args} />
);

Template.storyName = 'BreadCrumbs';
Template.args = {
  locationPath: '/treasury/tokens/near',
  testString: 'Switch to mobile view'
};
