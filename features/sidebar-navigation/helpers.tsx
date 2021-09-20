import { Sidebar } from 'components/sidebar';
import { AddGroupMenu } from 'features/groups/components/add-group-menu';
import React, { useMemo } from 'react';
import { useSelectedDAO } from 'hooks/useSelectedDao';

import {
  GOVERNANCE_SECTION_ID,
  GROUPS_SECTION_ID,
  TASKS_SECTION_ID,
  TREASURY_SECTION_ID
} from './constants';

const sidebarItems: React.ComponentProps<typeof Sidebar>['items'] = [
  {
    id: TASKS_SECTION_ID,
    label: 'Tasks',
    logo: 'stateTasks',
    subItems: [
      {
        id: 'bounties',
        label: 'Bounties',
        href: `/dao/[dao]/${TASKS_SECTION_ID}/bounties`
      },
      {
        id: 'polls',
        label: 'Polls',
        href: `/dao/[dao]/${TASKS_SECTION_ID}/polls`
      },
      {
        id: 'plugins',
        label: 'Plugins',
        href: `/dao/[dao]/${TASKS_SECTION_ID}/plugins`,
        disabled: true
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
        href: `/dao/[dao]/${TREASURY_SECTION_ID}/tokens`,
        subHrefs: ['/dao/[dao]/treasury/tokens/transactions/[tokenId]']
      },
      {
        id: 'nfts',
        label: 'NFTs',
        href: `/dao/[dao]/${TREASURY_SECTION_ID}/nfts`
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
        label: <AddGroupMenu />
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
        href: `/dao/[dao]/${GOVERNANCE_SECTION_ID}/settings`
      },
      {
        id: 'votingPolicy',
        label: 'Voting Policy',
        href: `/dao/[dao]/${GOVERNANCE_SECTION_ID}/voting-policy`
      },
      {
        id: 'votingToken',
        label: 'Voting Token',
        href: `/dao/[dao]/${GOVERNANCE_SECTION_ID}/voting-token`
      },
      {
        id: 'upgradeSoftware',
        label: 'Upgrade software',
        href: `/dao/[dao]/${GOVERNANCE_SECTION_ID}/upgrade-software`
      }
    ]
  }
];

type TSidebarData = React.ComponentProps<typeof Sidebar>['items'];

export const useSidebarData = (): TSidebarData => {
  const selectedDao = useSelectedDAO();

  return useMemo(() => {
    const groups = {} as Record<string, string>;

    selectedDao?.groups.forEach(group => {
      groups[group.name] = group.slug;
    });

    return sidebarItems.map(item => {
      if (item.id === GROUPS_SECTION_ID) {
        return {
          ...item,
          subItems: [
            ...item.subItems,
            {
              id: 'allMembers',
              label: 'All Members',
              href: `/dao/[dao]/${GROUPS_SECTION_ID}/[group]`,
              as: `/dao/${selectedDao?.id}/${GROUPS_SECTION_ID}/all-members`
            },
            ...Object.keys(groups).map(key => {
              let href;

              if (key !== 'all-groups') {
                href = {
                  href: `/dao/[dao]/${GROUPS_SECTION_ID}/[group]`,
                  as:
                    key !== 'all-groups'
                      ? `/dao/${selectedDao?.id}/${GROUPS_SECTION_ID}/${groups[key]}`
                      : undefined
                };
              } else {
                href = {
                  href: `/dao/[dao]/${GROUPS_SECTION_ID}/${groups[key]}`
                };
              }

              return {
                ...href,
                id: key,
                label: key
              };
            })
          ]
        };
      }

      return item;
    });
  }, [selectedDao?.groups, selectedDao?.id]);
};
