import React, { useEffect, useState } from 'react';
import get from 'lodash.get';

import { Sidebar } from 'components/sidebar';
import { AddGroupMenu } from 'features/groups/components/add-group-menu';

import { SputnikService } from 'services/SputnikService';
import { useAuthContext } from 'context/AuthContext';

import { DaoItem, TRole } from 'types/dao';

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

export type DaoListItem = {
  logo: string;
  label: string;
} & DaoItem;

type TSidebarData = {
  daosList: DaoListItem[];
  menuItems: React.ComponentProps<typeof Sidebar>['items'];
};

export const useSidebarData = (): TSidebarData => {
  const { accountId } = useAuthContext();
  const [daosList, setDaosList] = useState<DaoListItem[]>([]);

  // Todo - we have to dynamically get list of available groups and generate sidebar menu items
  const menuItems = sidebarItems.map(item => {
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

  useEffect(() => {
    // TODO - fetch daos specifically for logged user then we can remove filtering
    SputnikService.getDaoList()
      .then(res => {
        const userDaos = res
          .filter(item => {
            const daoPolicyRoles = get(item, 'policy.roles', []);
            const councilRoles = daoPolicyRoles.find(
              (role: TRole) => role.name === 'council'
            );
            const group = get(councilRoles, 'kind.group', []);

            return group.includes(accountId);
          })
          .map(item => ({
            ...item,
            label: item.name,
            id: item.id,
            logo: 'https://i.imgur.com/t5onQz9.png',
            count: 10
          }));

        setDaosList(userDaos);
      })
      .catch(err => {
        console.error(err);
      });
  }, [accountId]);

  return { daosList, menuItems };
};
