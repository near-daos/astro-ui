import React from 'react';
import { Meta } from '@storybook/react';
import { NavItem } from 'components/nav-item/NavItem';

export default {
  title: 'Components/Sidebar/NavItem',
  component: NavItem,
  parameters: {
    backgrounds: {
      default: 'sidebar',
      values: [
        {
          name: 'sidebar',
          value: '#251455'
        }
      ]
    },
    nextRouter: {
      pathname: '/',
      asPath: '/'
    }
  }
} as Meta;

export const Template = (
  args: React.ComponentProps<typeof NavItem>
): JSX.Element => {
  return <NavItem {...args} />;
};

Template.storyName = 'NavItem';

Template.args = {
  href: '#',
  icon: 'stateGear',
  label: 'Option'
};
