import React from 'react';
import { Sidebar } from 'components/sidebar/Sidebar';
import { Meta } from '@storybook/react';

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark'
    },
    nextRouter: {
      pathname: '/',
      asPath: '/'
    }
  }
} as Meta;

export const Template = (
  args: React.ComponentProps<typeof Sidebar>
): JSX.Element => (
  <>
    <Sidebar {...args} />
  </>
);

const daoList = [
  {
    label: 'Dao Name 1',
    id: 'dao-1',
    count: 31,
    logo: 'https://i.imgur.com/CklXZzD.png'
  },
  {
    label: 'Dao Name 2',
    id: 'dao-2',
    logo: 'https://i.imgur.com/iPUZZ0D.png'
  },
  {
    label: 'Dao Name 3',
    id: 'dao-3',
    logo: 'https://i.imgur.com/t5onQz9.png',
    count: 1034
  }
];

const items: React.ComponentProps<typeof Sidebar>['items'] = [
  {
    label: 'Overview',
    href: '#',
    logo: 'stateOverview',
    count: 103,
    subItems: []
  },
  {
    label: 'Tasks',
    href: '#',
    logo: 'stateTasks',
    subItems: [
      {
        label: 'Bounties',
        href: '#'
      },
      {
        label: 'Polls',
        href: '#'
      },
      {
        label: 'Plugins',
        href: '#'
      }
    ]
  },
  {
    label: 'Treasury',
    href: '#',
    logo: 'stateTreasury',
    subItems: [
      {
        label: 'Tokens',
        href: '#'
      },
      {
        label: 'NFTs',
        href: '#'
      },
      {
        label: 'Plugins',
        href: '#'
      }
    ]
  },
  {
    label: 'A long thing to take a space',
    href: '#',
    logo: 'stateGear',
    subItems: [...new Array(43)].map((_, index) => ({
      label: `Test ${index}`,
      href: '#'
    }))
  }
];

Template.storyName = 'Sidebar';
Template.args = {
  daoList,
  items
};
