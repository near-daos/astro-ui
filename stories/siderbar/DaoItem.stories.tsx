import React from 'react';
import { Meta } from '@storybook/react';
import { DaoItem } from 'components/nav-dao/DaoItem';

/* Would make more sense with future dynamic flag functionality */
export default {
  title: 'Components/Sidebar/DaoItem',
  component: DaoItem,
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
  args: React.ComponentProps<typeof DaoItem>
): JSX.Element => {
  return <DaoItem {...args} />;
};

Template.storyName = 'DaoItem';

Template.args = {
  href: '#',
  logo: 'https://i.imgur.com/iPUZZ0D.png',
  label: 'Dao Name 1',
  count: 22
};
