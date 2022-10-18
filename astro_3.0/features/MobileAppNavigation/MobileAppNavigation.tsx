import React, { ComponentProps, FC, useMemo } from 'react';

import { SidebarNavItem } from 'astro_3.0/features/Sidebar/components/SidebarNavItem';
import {
  ALL_DAOS_URL,
  ALL_FEED_URL,
  BOUNTIES,
  CREATE_DAO_URL,
  MY_FEED_URL,
} from 'constants/routing';
import { MobileNavItem } from 'astro_3.0/features/MobileAppNavigation/components/MobileNavItem/MobileNavItem';
import { MoreInfo } from 'astro_3.0/features/MobileAppNavigation/components/MoreInfo';

import styles from './MobileAppNavigation.module.scss';

export const MobileAppNavigation: FC = () => {
  const navItems: ComponentProps<typeof SidebarNavItem>[] = useMemo(() => {
    return [
      {
        icon: 'sidebarHome',
        label: 'Home',
        href: [MY_FEED_URL, ALL_FEED_URL],
        actionsCount: 0,
      },
      {
        icon: 'sidebarDaosAndUsers',
        label: 'Discovery',
        href: ALL_DAOS_URL,
      },
      {
        icon: 'plus',
        label: 'Create DAO',
        href: CREATE_DAO_URL,
      },
      {
        icon: 'briefcase',
        label: 'Bounties area',
        href: BOUNTIES,
      },
    ];
  }, []);

  return (
    <div className={styles.root}>
      {navItems.map(item => {
        return <MobileNavItem key={item.label} {...item} />;
      })}
      <MoreInfo />
    </div>
  );
};
