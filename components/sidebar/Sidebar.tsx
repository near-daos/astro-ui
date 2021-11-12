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
import { NavSubItem } from 'components/nav-item/NavSubItem';
import { Collapsable } from 'components/collapsable/Collapsable';

import { AppFooter } from 'features/app-footer';

import { DaoNavMenu } from './components/DaoNavMenu';

import styles from './Sidebar.module.scss';

interface SidebarProps {
  className?: string;
  fullscreen?: boolean;
  closeSideBar?: () => void;
}

const NOT_COLLAPSABLE_MENU_ITEMS = [
  MY_DAOS_URL,
  MY_FEED_URL,
  ALL_DAOS_URL,
  ALL_FEED_URL
];

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

  function isSectionExpanded(hrefs: string[]): boolean {
    const { pathname } = router;

    return hrefs.includes(pathname);
  }

  function renderHomeNavItem() {
    if (accountId) {
      const subHrefs = [MY_DAOS_URL, MY_FEED_URL];
      const { route } = router;

      const isExpanded = isSectionExpanded(subHrefs);
      const notCollapsable =
        NOT_COLLAPSABLE_MENU_ITEMS.includes(route) && isExpanded;

      return (
        <Collapsable
          initialOpenState={notCollapsable || isExpanded}
          renderHeading={toggle => {
            return (
              <NavItem
                label="Home"
                icon="stateHome"
                onClick={notCollapsable ? undefined : toggle}
                className={styles.item}
                subHrefs={subHrefs}
              />
            );
          }}
        >
          <NavSubItem label="My Daos" href={MY_DAOS_URL} />
          <NavSubItem label="My Feed" href={MY_FEED_URL} />
        </Collapsable>
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

  function renderAllCommunities() {
    const subHrefs = [ALL_DAOS_URL, ALL_FEED_URL];
    const { route } = router;

    const isExpanded = isSectionExpanded(subHrefs);
    const notCollapsable =
      NOT_COLLAPSABLE_MENU_ITEMS.includes(route) && isExpanded;

    return (
      <nav className={styles.bottom}>
        <Collapsable
          initialOpenState={notCollapsable || isExpanded}
          renderHeading={toggle => {
            return (
              <NavItem
                onClick={notCollapsable ? undefined : toggle}
                subHrefs={subHrefs}
                label="All Communities"
                icon="stateCommunities"
                className={styles.item}
              />
            );
          }}
        >
          <NavSubItem label="Explore Daos" href={ALL_DAOS_URL} />
          <NavSubItem label="Astro Feed" href={ALL_FEED_URL} />
        </Collapsable>
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
        <div className={styles.powered}>
          <a
            className={styles.devLink}
            href="https://near.org"
            target="_blank"
            rel="noreferrer noopener"
          >
            <span>powered by</span>
            <i>
              <Icon name="logoNearFull" width={77} className={styles.logo} />
            </i>
          </a>
        </div>
        <div className={styles.scrolling}>
          {renderHomeNavItem()}
          {renderAllCommunities()}
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
