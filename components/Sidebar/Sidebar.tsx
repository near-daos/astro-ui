import cn from 'classnames';
import { useMount } from 'react-use';
import { useRouter } from 'next/router';
import React, { forwardRef, useCallback } from 'react';

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

import styles from './Sidebar.module.scss';

interface SidebarProps {
  className?: string;
  fullscreen?: boolean;
  closeSideBar?: () => void;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>((props, ref) => {
  const { className, fullscreen, closeSideBar } = props;

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
      return (
        <div>
          <NavItem
            label="My DAOs"
            icon="myDaos"
            className={styles.item}
            href={MY_DAOS_URL}
          />
          <NavItem
            label="My Feed"
            icon="myFeed"
            className={styles.item}
            href={MY_FEED_URL}
          />
          <div className={styles.divider} />
        </div>
      );
    }

    return null;
  }

  function renderAllCommunities() {
    return (
      <nav className={styles.bottom}>
        <NavItem
          label="Global Feed"
          icon="globalFeed"
          className={styles.item}
          href={ALL_FEED_URL}
        />
        <NavItem
          label="All Communities"
          icon="allCommunity"
          className={styles.item}
          href={ALL_DAOS_URL}
        />
        <div className={styles.divider} />
      </nav>
    );
  }

  return (
    <aside className={rootClassName} ref={ref}>
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
        <div className={styles.subheader}>
          <a
            className={styles.devLink}
            href="https://doc.clickup.com/p/h/4fh9y-341/f6e2cb99c0b9ce3"
            target="_blank"
            rel="noreferrer noopener"
          >
            Build number: 22.0
          </a>
        </div>
        <div className={styles.scrolling}>
          {renderHomeNavItem()}
          {renderAllCommunities()}
          <NavItem
            href={CREATE_DAO_URL}
            className={styles.item}
            onClick={createDao}
            label="Create New DAO"
            icon="createNewDao"
          />
        </div>
      </div>
      <AppFooter />
    </aside>
  );
});

Sidebar.defaultProps = {
  className: '',
  fullscreen: false,
  closeSideBar: undefined,
};
