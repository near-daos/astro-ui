import React, { FC } from 'react';
import { Sidebar } from 'components/sidebar/Sidebar';
import { AddGroupMenu } from 'features/groups/components/add-group-menu';

import {
  TASKS_SECTION_ID,
  GROUPS_SECTION_ID,
  TREASURY_SECTION_ID,
  GOVERNANCE_SECTION_ID
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
        href: `/${GOVERNANCE_SECTION_ID}/dao-settings`
      },
      {
        id: 'votingPolicy',
        label: 'Voting Policy',
        href: `/${GOVERNANCE_SECTION_ID}/voting-policy`
      },
      {
        id: 'votingToken',
        label: 'Voting Token',
        href: `/${GOVERNANCE_SECTION_ID}/voting-token`
      },
      {
        id: 'upgradeSoftware',
        label: 'Upgrade software Token',
        href: `/${GOVERNANCE_SECTION_ID}/upgrade-software`
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

interface SidebarNavigationProps {
  className?: string;
  fullscreen?: boolean;
  closeSideBar?: () => void;
}

export const SidebarNavigation: FC<SidebarNavigationProps> = ({
  className,
  fullscreen,
  closeSideBar
}) => {
  // Todo - we have to dynamically get list of available groups and generate sidebar menu items
  const items = sidebarItems.map(item => {
    if (item.id === GROUPS_SECTION_ID) {
      return {
        ...item,
        subItems: [
          ...item.subItems,
          ...availableGroups.map(group => ({
            id: group.name,
            label: group.name,
            href: `/${GROUPS_SECTION_ID}/${group.slug}`
          }))
        ]
      };
    }

    return item;
  });

  return (
    <Sidebar
      daoList={[]}
      items={items}
      className={className}
      fullscreen={fullscreen}
      closeSideBar={closeSideBar}
    />
  );
};
