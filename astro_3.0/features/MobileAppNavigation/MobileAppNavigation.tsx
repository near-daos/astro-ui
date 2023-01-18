import React, { ComponentProps, FC, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

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
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { useWalletContext } from 'context/WalletContext';

import styles from './MobileAppNavigation.module.scss';

export const MobileAppNavigation: FC = () => {
  const router = useRouter();

  const { accountId, login } = useWalletContext();

  const handleCreateDao = useCallback(() => {
    const url = { pathname: CREATE_DAO_URL, query: { step: 'info' } };

    return accountId ? router.push(url) : login();
  }, [login, router, accountId]);

  const navItems = useMemo(() => {
    const navItems1: ComponentProps<typeof SidebarNavItem>[] = [
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
    ];

    const navItems2: ComponentProps<typeof SidebarNavItem>[] = [
      {
        icon: 'briefcase',
        label: 'Bounties area',
        href: BOUNTIES,
      },
    ];

    return [navItems1, navItems2];
  }, []);

  return (
    <div className={styles.root}>
      {navItems[0].map(item => {
        return <MobileNavItem key={item.label} {...item} />;
      })}
      <Button
        variant="transparent"
        size="small"
        className={cn(styles.btn)}
        onClick={handleCreateDao}
      >
        <div className={cn(styles.iconWrapper)}>
          <Icon name="plus" className={cn(styles.icon)} />
        </div>
        <div className={styles.label}>Create DAO</div>
      </Button>
      {navItems[1].map(item => {
        return <MobileNavItem key={item.label} {...item} />;
      })}
      <MoreInfo />
    </div>
  );
};
