import cn from 'classnames';
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
import { AppFooter } from 'astro_2.0/components/AppFooter';
import { NavItem } from './components/NavItem';

import styles from './Sidebar.module.scss';

interface SidebarProps {
  className?: string;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>((props, ref) => {
  const { className } = props;

  const router = useRouter();

  const { accountId, login } = useAuthContext();

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
      <div className={styles.bottom}>
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
      </div>
    );
  }

  return (
    <aside className={cn(styles.sidebar, className)} ref={ref}>
      <div className={styles.wrapper}>
        <Logo className={styles.mainLogo} />
        <div className={styles.subheader}>
          <span>powered by</span>
          <i>
            <Icon name="logoNearFull" width={44} className={styles.logo} />
          </i>
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
};
