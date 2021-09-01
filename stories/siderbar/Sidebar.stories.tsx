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
    logo: ''
  },
  {
    label: 'Dao Name 2',
    id: 'dao-2',
    logo: ''
  },
  {
    label: 'Dao Name 3',
    id: 'dao-3',
    logo: '',
    count: 1034
  }
];

const items: React.ComponentProps<typeof Sidebar>['items'] = [
  {
    id: 'overview',
    label: 'Overview',
    href: '#',
    logo: 'stateOverview',
    count: 103,
    subItems: []
  },
  {
    id: 'tasks',
    label: 'Tasks',
    href: '#',
    logo: 'stateTasks',
    subItems: [
      {
        id: 'bounties',
        label: 'Bounties',
        href: '#'
      },
      {
        id: 'polls',
        label: 'Polls',
        href: '#'
      },
      {
        id: 'plugins',
        label: 'Plugins',
        href: '#'
      }
    ]
  },
  {
    id: 'treasury',
    label: 'Treasury',
    href: '#',
    logo: 'stateTreasury',
    subItems: [
      {
        id: 'tokens',
        label: 'Tokens',
        href: '#'
      },
      {
        id: 'nfts',
        label: 'NFTs',
        href: '#'
      },
      {
        id: 'plugins',
        label: 'Plugins',
        href: '#'
      }
    ]
  },
  {
    id: 'test',
    label: 'A long thing to take a space',
    href: '#',
    logo: 'stateGear',
    subItems: [...new Array(43)].map((_, index) => ({
      id: `test_${index}`,
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
