import cn from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { useCookie, useMount } from 'react-use';
import React, { ReactNode, useCallback } from 'react';

import {
  MY_DAOS_URL,
  MY_FEED_URL,
  ALL_DAOS_URL,
  ALL_FEED_URL,
  CREATE_DAO_URL
} from 'constants/routing';
import { DAO_COOKIE } from 'constants/cookies';

import { useAuthContext } from 'context/AuthContext';

import { Logo } from 'components/logo/Logo';
import { Icon, IconName } from 'components/Icon';
import { DaoList } from 'components/nav-dao/DaoList';
import { NavItem } from 'components/nav-item/NavItem';
import { NavSubItem } from 'components/nav-item/NavSubItem';
import { Collapsable } from 'components/collapsable/Collapsable';

import { AppFooter } from 'features/app-footer';

import { useAccordion } from 'hooks/useAccordion';

import styles from './sidebar.module.scss';

interface ItemBase {
  id: string;
  label: string | ReactNode;
  href?: string;
  count?: number;
  subHrefs?: string[];
  disabled?: boolean;
  as?: string;
}

interface MenuItem extends Omit<ItemBase, 'href' | 'subHrefs'> {
  subItems: ItemBase[];
  logo: IconName;
  href?: string;
  disabled?: boolean;
  as?: string;
}

interface SidebarProps {
  daoList: React.ComponentProps<typeof DaoList>['items'];
  items: MenuItem[];
  className?: string;
  fullscreen?: boolean;
  closeSideBar?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  daoList,
  items,
  className,
  fullscreen,
  closeSideBar
}) => {
  const router = useRouter();
  const [selectedDao] = useCookie(DAO_COOKIE);
  const { accountId, login } = useAuthContext();
  const showDaoNavItems = !!daoList.length && !!accountId;
  const activeGroupId = get(router.asPath.split('/'), 3);

  const { getItemProps } = useAccordion({
    allowUnSelect: true,
    allowMultiSelect: false,
    preSelected: (() => {
      if (activeGroupId === 'dao') return [];

      return isEmpty(activeGroupId) ? [] : [activeGroupId];
    })()
  });

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

  function renderSelectedDaoAdditionalPages() {
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

    return (
      <nav className={styles.menu}>
        {items.map(item => {
          if (isEmpty(item.subItems)) {
            return (
              <NavItem
                key={item.id}
                className={styles.item}
                label={item.label}
                count={item.count}
                href={item.href}
                icon={item.logo}
              />
            );
          }

          return (
            <Collapsable
              {...getItemProps(item.id)}
              key={item.id}
              duration={250}
              renderHeading={toggle => (
                <NavItem
                  onClick={() => toggle()}
                  className={styles.item}
                  label={item.label}
                  count={item.count}
                  href={item.href}
                  icon={item.logo}
                  active={activeGroupId === item.id}
                />
              )}
            >
              {item.subItems.map(subItem => (
                <NavSubItem
                  key={subItem.id}
                  count={subItem.count}
                  label={subItem.label}
                  href={subItem.href}
                  as={subItem.as}
                  disabled={subItem.disabled}
                  urlParams={{ dao: selectedDao }}
                  subHrefs={subItem.subHrefs}
                />
              ))}
            </Collapsable>
          );
        })}
      </nav>
    );
  }

  function renderDaoNavItems() {
    if (showDaoNavItems) {
      return (
        <>
          <DaoList {...getItemProps('dao')} items={daoList} />
          {renderSelectedDaoAdditionalPages()}
        </>
      );
    }

    return null;
  }

  function renderNavItemsOfLoggedUser() {
    if (accountId) {
      return (
        <>
          <NavItem
            label="Home"
            icon="stateHome"
            href={MY_DAOS_URL}
            subHrefs={[MY_FEED_URL]}
            className={styles.item}
          >
            <NavSubItem label="My Daos" href={MY_DAOS_URL} />
            <NavSubItem label="My Feed" href={MY_FEED_URL} />
          </NavItem>
          <NavItem
            className={styles.item}
            onClick={createDao}
            label="Create a DAO"
            icon="stateCreateDao"
          />
        </>
      );
    }

    return null;
  }

  function renderAllCommunities() {
    return (
      <nav className={styles.bottom}>
        <NavItem
          href={ALL_DAOS_URL}
          subHrefs={[ALL_FEED_URL]}
          label="All Communities"
          icon="stateCommunities"
          className={styles.item}
        >
          <NavSubItem label="Explore Daos" href={ALL_DAOS_URL} />
          <NavSubItem label="Astro Feed" href={ALL_FEED_URL} />
        </NavItem>
        <div className={styles.delimiter} />
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
          {renderNavItemsOfLoggedUser()}
          {renderAllCommunities()}
          {renderDaoNavItems()}
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
