import cn from 'classnames';
import { useMount } from 'react-use';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import {
  MY_DAOS_URL,
  MY_FEED_URL,
  ALL_DAOS_URL,
  ALL_FEED_URL,
  CREATE_DAO_URL
} from 'constants/routing';

import { useAuthContext } from 'context/AuthContext';

import { Logo } from 'components/Logo';
import { Icon } from 'components/Icon';
import { NavItem } from 'components/nav-item/NavItem';
import { AppFooter } from 'features/app-footer';
import { DaoNavMenu } from './components/DaoNavMenu';

import styles from './Sidebar.module.scss';

interface SidebarProps {
  className?: string;
  fullscreen?: boolean;
  closeSideBar?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  className,
  fullscreen,
  closeSideBar
}) => {
  const router = useRouter();

  const { accountId, login } = useAuthContext();

  const rootClassName = cn(styles.sidebar, className, {
    [styles.fullscreen]: fullscreen
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
      return (
        <>
          <NavItem
            label="My feed"
            icon="stateHome"
            href={MY_FEED_URL}
            className={styles.item}
          />
          <NavItem
            label="Global feed"
            icon="stateHome"
            href={ALL_FEED_URL}
            className={styles.item}
          />
        </>
      );
    }

    return null;
  }

  function renderCreateDaoNavItem() {
    if (accountId) {
      return (
        <NavItem
          className={styles.item}
          onClick={createDao}
          label="Create a DAO"
          icon="stateCreateDao"
        />
      );
    }

    return null;
  }

  function renderCommunities() {
    return (
      <nav className={styles.bottom}>
        <>
          <NavItem
            label="My Communities"
            href={MY_DAOS_URL}
            icon="stateCommunities"
            className={styles.item}
          />
          <NavItem
            label="All Communities"
            href={ALL_DAOS_URL}
            icon="stateCommunities"
            className={styles.item}
          />
        </>
      </nav>
    );
  }

  function renderDaoNavItems() {
    const { route } = router;

    if (
      [
        MY_DAOS_URL,
        MY_FEED_URL,
        ALL_DAOS_URL,
        ALL_FEED_URL,
        CREATE_DAO_URL
      ].includes(route)
    ) {
      return null;
    }

    return <DaoNavMenu />;
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
          {renderCommunities()}
          {renderDaoNavItems()}
          {renderCreateDaoNavItem()}
        </div>
      </div>
      <AppFooter isLoggedIn />
    </aside>
  );
};

Sidebar.defaultProps = {
  className: '',
  fullscreen: false,
  closeSideBar: undefined
};
