import cn from 'classnames';
import { useMount } from 'react-use';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import {
  MY_DAOS_URL,
  MY_FEED_URL,
  ALL_DAOS_URL,
  ALL_FEED_URL,
  CREATE_DAO_URL,
} from 'constants/routing';

import { useAuthContext } from 'context/AuthContext';

import { Logo } from 'components/Logo';
import { Icon } from 'components/Icon';

import { AppFooter } from 'features/app-footer';

import { NavItem } from './components/NavItem';
import { NavSubItem } from './components/NavSubItem';

import styles from './Sidebar.module.scss';

interface SidebarProps {
  className?: string;
  fullscreen?: boolean;
  closeSideBar?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  className,
  fullscreen,
  closeSideBar,
}) => {
  const router = useRouter();

  const { accountId, login } = useAuthContext();

  const rootClassName = cn(styles.sidebar, className, {
    [styles.fullscreen]: fullscreen,
  });

  useMount(() => {
    function close() {
      closeSideBar?.();
    }

    router.events.on('routeChangeComplete', close);

    return () => router.events.off('routeChangeComplete', close);
  });

  const createDao = useCallback(
    () => (accountId ? router.push(CREATE_DAO_URL) : login()),
    [login, router, accountId]
  );

  function renderHomeNavItem() {
    if (accountId) {
      const subHrefs = [MY_DAOS_URL, MY_FEED_URL];

      return (
        <div>
          <NavItem
            label="Home"
            icon="stateHome"
            className={styles.item}
            subHrefs={subHrefs}
          />
          <NavSubItem label="My Daos" href={MY_DAOS_URL} />
          <NavSubItem label="My Feed" href={MY_FEED_URL} />
        </div>
      );
    }

    return null;
  }

  function renderAllCommunities() {
    const subHrefs = [ALL_DAOS_URL, ALL_FEED_URL];

    return (
      <nav className={styles.bottom}>
        <div>
          <NavItem
            subHrefs={subHrefs}
            label="All Communities"
            icon="stateCommunities"
            className={styles.item}
          />
          <NavSubItem label="Explore Daos" href={ALL_DAOS_URL} />
          <NavSubItem label="Astro Feed" href={ALL_FEED_URL} />
        </div>
      </nav>
    );
  }

  return (
    <aside className={rootClassName}>
      <div className={styles.wrapper}>
        <div className={styles.mobileHeader}>
          <Icon
            name="close"
            className={styles.closeIcon}
            onClick={closeSideBar}
          />
          <Icon name="appLogo" width={92} />
        </div>
        <Logo className={styles.mainLogo} />
        <div className={styles.scrolling}>
          {renderHomeNavItem()}
          {renderAllCommunities()}
          <NavItem
            subHrefs={[CREATE_DAO_URL]}
            className={styles.item}
            onClick={createDao}
            label="Create a DAO"
            icon="stateCreateDao"
          />
        </div>
      </div>
      <AppFooter />
    </aside>
  );
};

Sidebar.defaultProps = {
  className: '',
  fullscreen: false,
  closeSideBar: undefined,
};
