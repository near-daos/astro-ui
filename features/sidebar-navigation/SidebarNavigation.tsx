import React, { FC } from 'react';
import { Sidebar } from 'components/sidebar/Sidebar';
import { AddGroupMenu } from 'features/groups/components/add-group-menu';

const sidebarItems: React.ComponentProps<typeof Sidebar>['items'] = [
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
        href: '/treasury/tokens'
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
    id: 'groups',
    label: 'Groups',
    href: '#',
    logo: 'stateMembersgroups',
    subItems: [
      {
        id: 'addGroup',
        label: <AddGroupMenu />,
        href: '#'
      },
      {
        id: 'allMembers',
        label: 'All Members',
        href: '/groups/all-members'
      }
    ]
  },
  {
    id: 'governance',
    label: 'Governance',
    href: '#',
    logo: 'stateGovernance',
    subItems: [
      {
        id: 'daoSettings',
        label: 'DAO settings',
        href: '/governance/dao-settings'
      },
      {
        id: 'votingPolicy',
        label: 'Voting Policy',
        href: '/governance/voting-policy'
      },
      {
        id: 'votingToken',
        label: 'Voting Token',
        href: '/governance/voting-token'
      },
      {
        id: 'upgradeSoftware',
        label: 'Upgrade software Token',
        href: '/governance/upgrade-software'
      }
    ]
  }
];

const availableGroups = [
  {
    name: 'MEW holders',
    slug: 'mew-holders'
  },
  {
    name: 'NEAR holder',
    slug: 'near-holders'
  },
  {
    name: 'Ombudspeople',
    slug: 'ombudspeople'
  }
];

export const SidebarNavigation: FC = () => {
  // Todo - we have to dynamically get list of available groups and generate sidebar menu items
  const items = sidebarItems.map(item => {
    if (item.label === 'Groups') {
      return {
        ...item,
        subItems: [
          ...item.subItems,
          ...availableGroups.map(group => ({
            id: group.name,
            label: group.name,
            href: `/groups/${group.slug}`
          }))
        ]
      };
    }

    return item;
  });

  return <Sidebar daoList={[]} items={items} />;
};
