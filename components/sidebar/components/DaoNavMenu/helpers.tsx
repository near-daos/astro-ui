import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import { MenuItem } from 'components/sidebar/types';

import { AddGroupMenu } from 'features/groups/components/add-group-menu';

import { SputnikService } from 'services/SputnikService';
import { DAO } from 'types/dao';
import {
  TASKS_SECTION_ID,
  GROUPS_SECTION_ID,
  TREASURY_SECTION_ID,
  GOVERNANCE_SECTION_ID
} from './constants';

export const useGetDaoNavItems = (): MenuItem[] => {
  const router = useRouter();
  const accountId = SputnikService.getAccountId();

  const [selectedDao, setSelectedDao] = useState<DAO | null>();

  const selectedDaoId = router.query.dao as string;

  useEffect(() => {
    if (accountId) {
      SputnikService.getDaoById(selectedDaoId).then(setSelectedDao);
    }
  }, [accountId, selectedDaoId]);

  const sidebarItems: MenuItem[] = useMemo(() => {
    return [
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
            href: `/dao/[dao]/${GOVERNANCE_SECTION_ID}/voting-token`,
            disabled: true
          },
          {
            id: 'upgradeSoftware',
            label: 'Upgrade software',
            href: `/dao/[dao]/${GOVERNANCE_SECTION_ID}/upgrade-software`,
            disabled: true
          }
        ]
      }
    ];
  }, []);

  const menuItems = useMemo(() => {
    const groups = {} as Record<string, string>;

    selectedDao?.groups.forEach(group => {
      groups[group.name] = group.slug;
    });

    return sidebarItems.map(item => {
      if (item.id === GROUPS_SECTION_ID && selectedDao) {
        return {
          ...item,
          subItems: [
            ...item.subItems,
            {
              id: 'allMembers',
              label: 'All Members',
              href: `/dao/${selectedDao?.id}/${GROUPS_SECTION_ID}/all-members`
            },
            ...Object.keys(groups).map(key => {
              let href;

              if (key !== 'all-groups') {
                href = {
                  href: `/dao/${selectedDao?.id}/${GROUPS_SECTION_ID}/${groups[key]}`
                };
              } else {
                href = {
                  href: `/dao/${selectedDao?.id}/${GROUPS_SECTION_ID}/${groups[key]}`
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
  }, [selectedDao, sidebarItems]);

  return menuItems;
};
