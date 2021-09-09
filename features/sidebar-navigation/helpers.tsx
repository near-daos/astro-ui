import React from 'react';
import { useSelector } from 'react-redux';

import { DAO } from 'types/dao';
import { selectDAOs } from 'store/dao';
import { Sidebar } from 'components/sidebar';
import { AddGroupMenu } from 'features/groups/components/add-group-menu';

import {
  GOVERNANCE_SECTION_ID,
  GROUPS_SECTION_ID,
  TASKS_SECTION_ID,
  TREASURY_SECTION_ID
} from './constants';

const sidebarItems: React.ComponentProps<typeof Sidebar>['items'] = [
  {
    id: 'overview',
    label: 'Overview',
    href: '/overview',
    logo: 'stateOverview',
    count: 103,
    subItems: []
  },
  {
    id: TASKS_SECTION_ID,
    label: 'Tasks',
    logo: 'stateTasks',
    subItems: [
      {
        id: 'bounties',
        label: 'Bounties',
        href: `/${TASKS_SECTION_ID}/bounties`
      },
      {
        id: 'polls',
        label: 'Polls',
        href: `/${TASKS_SECTION_ID}/polls`
      },
      {
        id: 'plugins',
        label: 'Plugins',
        href: `/${TASKS_SECTION_ID}/plugins`
      }
    ]
  },
  {
    id: TREASURY_SECTION_ID,
    label: 'Treasury',
    logo: 'stateTreasury',
    subItems: [
      {
        id: 'tokens',
        label: 'Tokens',
        href: `/${TREASURY_SECTION_ID}/tokens`,
        subHrefs: ['/treasury/tokens/transactions/[tokenId]']
      },
      {
        id: 'nfts',
        label: 'NFTs',
        href: `/${TREASURY_SECTION_ID}/nfts`
      },
      {
        id: 'plugins',
        label: 'Plugins',
        href: `/${TREASURY_SECTION_ID}/plugins`
      }
    ]
  },
  {
    id: GROUPS_SECTION_ID,
    label: 'Groups',
    logo: 'stateMembersgroups',
    subItems: [
      {
        id: 'addGroup',
        label: <AddGroupMenu />,
        href: `/${GROUPS_SECTION_ID}/all-members`
      },
      {
        id: 'allMembers',
        label: 'All Members',
        href: `/${GROUPS_SECTION_ID}/all-members`
      }
    ]
  },
  {
    id: GOVERNANCE_SECTION_ID,
    label: 'Governance',
    logo: 'stateGovernance',
    subItems: [
      {
        id: 'daoSettings',
        label: 'DAO settings',
        href: `/dao/[id]/${GOVERNANCE_SECTION_ID}/settings`
      },
      {
        id: 'votingPolicy',
        label: 'Voting Policy',
        href: `/dao/[id]/${GOVERNANCE_SECTION_ID}/voting-policy`
      },
      {
        id: 'votingToken',
        label: 'Voting Token',
        href: `/dao/[id]/${GOVERNANCE_SECTION_ID}/voting-token`
      },
      {
        id: 'upgradeSoftware',
        label: 'Upgrade software Token',
        href: `/dao/[id]/${GOVERNANCE_SECTION_ID}/upgrade-software`
      }
    ]
  }
];

type TSidebarData = {
  daosList: DAO[];
  menuItems: React.ComponentProps<typeof Sidebar>['items'];
};

export const useSidebarData = (): TSidebarData => {
  const daosList = useSelector(selectDAOs);

  const groups = daosList.reduce((res, item) => {
    item.groups.forEach(group => {
      res[group.name] = group.slug;
    });

    return res;
  }, {} as Record<string, string>);

  // Todo - we have to dynamically get list of available groups and generate sidebar menu items
  const menuItems = sidebarItems.map(item => {
    if (item.id === GROUPS_SECTION_ID) {
      return {
        ...item,
        subItems: [
          ...item.subItems,
          ...Object.keys(groups).map(key => ({
            id: key,
            label: key,
            href: `/${GROUPS_SECTION_ID}/${groups[key]}`
          }))
        ]
      };
    }

    return item;
  });

  return { daosList, menuItems };
};
