import React, {
  ComponentProps,
  FC,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { useClickAway } from 'react-use';

import { SidebarNavItem } from 'astro_3.0/features/Sidebar/components/SidebarNavItem';
import { SidebarActionItem } from 'astro_3.0/features/Sidebar/components/SidebarActionItem';
import { SidebarDaos } from 'astro_3.0/features/Sidebar/components/SidebarDaos';
import { SidebarMore } from 'astro_3.0/features/Sidebar/components/SidebarMore';

import { useAvailableActionsCounters } from 'hooks/useAvailableActionsCounters';
import { useWalletContext } from 'context/WalletContext';

import { WalletType } from 'types/config';

import {
  ALL_DAOS_URL,
  ALL_FEED_URL,
  BOUNTIES,
  CFC_LIBRARY,
  CREATE_DAO_URL,
  MY_FEED_URL,
} from 'constants/routing';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

import styles from './Sidebar.module.scss';

export const Sidebar: FC = () => {
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef(null);
  const router = useRouter();

  const { accountId, login } = useWalletContext();
  const { proposalActionsCount } = useAvailableActionsCounters();

  const handleCreateDao = useCallback(() => {
    const url = { pathname: CREATE_DAO_URL, query: { step: 'info' } };

    return accountId
      ? router.push(url)
      : login(WalletType.NEAR).then(() => router.push(url));
  }, [login, router, accountId]);

  useClickAway(rootRef, e => {
    const rootResElement = (e.target as HTMLElement).closest(
      '#astro_sidebar-more'
    );

    if (!rootResElement) {
      setExpanded(false);
    }
  });

  const navItems: ComponentProps<typeof SidebarNavItem>[] = useMemo(() => {
    return [
      {
        icon: 'sidebarHome',
        label: 'Home',
        href: [MY_FEED_URL, ALL_FEED_URL],
        actionsCount: proposalActionsCount,
      },
      {
        icon: 'briefcase',
        label: 'Bounties area',
        href: BOUNTIES,
      },
      {
        icon: 'sidebarActionsLibrary',
        label: 'Actions Library',
        href: CFC_LIBRARY,
      },
      {
        icon: 'sidebarDaosAndUsers',
        label: 'DAOs',
        href: ALL_DAOS_URL,
      },
    ];
  }, [proposalActionsCount]);

  return (
    <div className={styles.root} ref={rootRef}>
      <div
        className={cn(styles.content, {
          [styles.expanded]: expanded,
        })}
      >
        <div className={styles.nav}>
          {navItems.map(item => (
            <SidebarNavItem key={item.label} {...item} />
          ))}
        </div>
        <div className={styles.separator}>
          <div className={styles.toggle}>
            <Button
              size="block"
              variant="transparent"
              className={styles.toggleButton}
              onClick={() => {
                setExpanded(!expanded);
              }}
            >
              <Icon name="buttonArrowRight" className={styles.toggleIcon} />
            </Button>
          </div>
        </div>
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
