import React, { ComponentProps, FC, useCallback, useMemo } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import { SidebarNavItem } from 'astro_3.0/features/Sidebar/components/SidebarNavItem';
import { SidebarActionItem } from 'astro_3.0/features/Sidebar/components/SidebarActionItem';
import { SidebarDaos } from 'astro_3.0/features/Sidebar/components/SidebarDaos';
import { SidebarMore } from 'astro_3.0/features/Sidebar/components/SidebarMore';

import { useAvailableActionsCounters } from 'hooks/useAvailableActionsCounters';
import { useWalletContext } from 'context/WalletContext';

import { WalletType } from 'types/config';

import {
  ALL_FEED_URL,
  CFC_LIBRARY,
  CREATE_DAO_URL,
  DISCOVER,
  MY_FEED_URL,
} from 'constants/routing';

import styles from './Sidebar.module.scss';

export const Sidebar: FC = () => {
  const router = useRouter();

  const { accountId, login } = useWalletContext();
  const { proposalActionsCount } = useAvailableActionsCounters();

  const handleCreateDao = useCallback(() => {
    const url = { pathname: CREATE_DAO_URL, query: { step: 'info' } };

    return accountId
      ? router.push(url)
      : login(WalletType.NEAR).then(() => router.push(url));
  }, [login, router, accountId]);

  const navItems: ComponentProps<typeof SidebarNavItem>[] = useMemo(() => {
    return [
      {
        icon: 'sidebarHome',
        label: 'Home',
        href: [MY_FEED_URL, ALL_FEED_URL],
        actionsCount: proposalActionsCount,
      },
      {
        icon: 'sidebarBounties',
        label: 'Bounties area',
        href: 'none',
      },
      {
        icon: 'sidebarActionsLibrary',
        label: 'Actions Library',
        href: CFC_LIBRARY,
      },
      {
        icon: 'sidebarDaosAndUsers',
        label: 'DAOs and Users',
        href: DISCOVER,
      },
    ];
  }, [proposalActionsCount]);

  return (
    <div className={styles.root}>
      <div className={cn(styles.content)}>
        <div className={styles.nav}>
          {navItems.map(item => (
            <SidebarNavItem key={item.label} {...item} />
          ))}
        </div>
        <div className={styles.separator} />
        <div className={styles.daos}>
          <SidebarDaos />
        </div>
        <div className={styles.separator} />
        <div className={styles.nav}>
          <SidebarActionItem
            label="Create DAO"
            icon="plus"
            onClick={handleCreateDao}
          />
        </div>

        <div className={cn(styles.nav, styles.last)}>
          <SidebarMore />
        </div>
      </div>
    </div>
  );
};
