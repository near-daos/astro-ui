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
    const content = [];

    if (accountId) {
      content.push(
        <NavItem
          label="My feed"
          key={MY_FEED_URL}
          icon="stateHome"
          href={MY_FEED_URL}
          className={styles.item}
        />
      );
    }

    content.push(
      <NavItem
        label="Global feed"
        icon="stateHome"
        key={ALL_FEED_URL}
        href={ALL_FEED_URL}
        className={styles.item}
      />
    );

    return content;
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
    const content = [];

    if (accountId) {
      content.push(
        <NavItem
          key={MY_DAOS_URL}
          label="My Communities"
          href={MY_DAOS_URL}
          icon="stateCommunities"
          className={styles.item}
        />
      );
    }

    content.push(
      <NavItem
        label="All Communities"
        key={ALL_DAOS_URL}
        href={ALL_DAOS_URL}
        icon="stateCommunities"
        className={styles.item}
      />
    );

    return <nav className={styles.bottom}>{content}</nav>;
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
