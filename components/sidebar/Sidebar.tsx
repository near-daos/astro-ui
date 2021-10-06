import cn from 'classnames';
import { Collapsable } from 'components/collapsable/Collapsable';
import { Icon, IconName } from 'components/Icon';

import { Logo } from 'components/logo/Logo';
import { DaoList } from 'components/nav-dao/DaoList';
import { NavItem } from 'components/nav-item/NavItem';
import { NavSubItem } from 'components/nav-item/NavSubItem';

import { AppFooter } from 'features/app-footer';
import { useAccordion } from 'hooks/useAccordion';

import { useHasDao } from 'hooks/useHasDao';
import { useSelectedDAO } from 'hooks/useSelectedDao';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import React, { ReactNode, useCallback } from 'react';
import { useMount } from 'react-use';

import { useAuthContext } from 'context/AuthContext';
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
  const hasDao = useHasDao();
  const { accountId, login } = useAuthContext();

  const showDaoNavItems = hasDao && !!accountId;

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
    () => (accountId ? router.push('/create-dao') : login()),
    [login, router, accountId]
  );

  const currentDao = useSelectedDAO();

  function renderSelectedDaoAdditionalPages() {
    const { route } = router;

    if (['/home', '/create-dao', '/all-communities'].includes(route)) {
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
                  urlParams={{ dao: currentDao?.id }}
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
          <NavItem
            topDelimiter
            className={styles.item}
            label="Home"
            href="/home"
            icon="stateHome"
          />
          <DaoList {...getItemProps('dao')} items={daoList} />
          {renderSelectedDaoAdditionalPages()}
        </>
      );
    }

    return null;
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
          {renderDaoNavItems()}
          <div className={styles.delimiter} />
          <nav className={styles.bottom}>
            <NavItem
              className={styles.item}
              label="All Communities"
              href="/all-communities"
              icon="stateCommunities"
            />
            <NavItem
              className={styles.item}
              onClick={createDao}
              label="Create a DAO"
              icon="stateCreateDao"
            />
          </nav>
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
