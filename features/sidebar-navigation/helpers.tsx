import { Sidebar } from 'components/sidebar';
import { AddGroupMenu } from 'features/groups/components/add-group-menu';
import React, { useEffect, useMemo, useState } from 'react';
import { getActiveProposalsCountByDao } from 'hooks/useAllProposals';
import { SputnikService } from 'services/SputnikService';
import { CookieService } from 'services/CookieService';
import { DAO } from 'types/dao';
import { useAccountData } from 'features/account-data';

import {
  GOVERNANCE_SECTION_ID,
  GROUPS_SECTION_ID,
  OVERVIEW_SECTION_ID,
  TASKS_SECTION_ID,
  TREASURY_SECTION_ID
} from './constants';

type TSidebarData = React.ComponentProps<typeof Sidebar>['items'];

function checkIfDaoDataLoaded(
  selectedDaoId: string | undefined,
  daos: DAO[] | null
) {
  if (!selectedDaoId || daos === null) {
    return false;
  }

  return !!daos.find(item => item.id === selectedDaoId);
}

export const useSidebarData = (): {
  daos: DAO[] | null;
  menuItems: TSidebarData;
} => {
  const { accountDaos } = useAccountData();
  const selectedDaoId = CookieService.get('selectedDao');
  const selectedDao = accountDaos?.find(item => item.id === selectedDaoId);
  const [daos, setDaos] = useState<DAO[] | null>(null);

  const daoDataLoaded = checkIfDaoDataLoaded(selectedDaoId, daos);

  const sidebarItems: React.ComponentProps<
    typeof Sidebar
  >['items'] = useMemo(() => {
    return [
      {
        id: OVERVIEW_SECTION_ID,
        label: 'Overview',
        logo: 'stateOverview',
        subItems: [],
        href: `/dao/${selectedDaoId}`
      },
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
  }, [selectedDaoId]);

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
  }, [selectedDao, sidebarItems]);

  useEffect(() => {
    async function fetchAdditionalData() {
      const accountId = SputnikService.getAccountId();

      if (accountId && !daoDataLoaded) {
        const proposals = accountDaos?.length
          ? await SputnikService.getActiveProposals(
              accountDaos.map(item => item.id),
              0,
              500
            )
          : [];
        const votesCountByDao = proposals.reduce((res, item) => {
          if (res[item.daoId] !== undefined) {
            res[item.daoId] += Object.keys(item.votes).length;
          } else {
            res[item.daoId] = Object.keys(item.votes).length;
          }

          return res;
        }, {} as Record<string, number>);
        const activeProposalsByDao = getActiveProposalsCountByDao(proposals);

        const updatedDaos = accountDaos?.map(dao => {
          return {
            ...dao,
            proposals: activeProposalsByDao[dao.id],
            votes: votesCountByDao[dao.id]
          };
        });

        setDaos(updatedDaos);
      }
    }

    fetchAdditionalData();
  }, [selectedDaoId, daoDataLoaded, accountDaos]);

  return {
    menuItems,
    daos
  };
};
