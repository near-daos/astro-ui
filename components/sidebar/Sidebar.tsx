import cn from 'classnames';
import { useMount } from 'react-use';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { useAccordion } from 'hooks/useAccordion';
import { Logo } from 'components/logo/Logo';
import { DaoList } from 'components/nav-dao/DaoList';
import { Collapsable } from 'components/collapsable/Collapsable';
import { NavItem } from 'components/nav-item/NavItem';
import { NavSubItem } from 'components/nav-item/NavSubItem';
import { Icon, IconName } from 'components/Icon';
import { AppFooter } from 'features/app-footer';

import styles from './sidebar.module.scss';

interface ItemBase {
  id: string;
  label: string | ReactNode;
  href: string;
  count?: number;
  subHrefs?: string[];
}

interface MenuItem extends Omit<ItemBase, 'href' | 'subHrefs'> {
  subItems: ItemBase[];
  logo: IconName;
  href?: string;
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
  const activeGroupId = get(router.asPath.split('/'), 1);

  const { getItemProps } = useAccordion({
    allowUnSelect: true,
    allowMultiSelect: false,
    preSelected: (() => {
      return isEmpty(activeGroupId) ? [] : [activeGroupId];
    })()
  });

  const rootClassName = cn(styles.sidebar, className, {
    [styles.fullscreen]: fullscreen
  });

  useMount(() => {
    function close() {
      if (closeSideBar) {
        closeSideBar();
      }
    }

    router.events.on('routeChangeComplete', close);

    return () => router.events.off('routeChangeComplete', close);
  });

  return (
    <aside className={rootClassName}>
      <div className={styles.wrapper}>
        <div className={styles.mobileHeader}>
          <Icon
            name="close"
            className={styles.closeIcon}
            onClick={closeSideBar}
          />
          <Icon name="whiteLogo" className={styles.logo} />
        </div>
        <Logo className={styles.mainLogo} />
        <DaoList {...getItemProps('dao')} items={daoList} />

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
                    subHrefs={subItem.subHrefs}
                  />
                ))}
              </Collapsable>
            );
          })}
        </nav>

        <nav className={styles.bottom}>
          <NavItem
            topDelimiter
            className={styles.item}
            label="Home"
            count={999}
            href="/"
            icon="stateHome"
          />
          <NavItem
            className={styles.item}
            label="All Communities"
            href="/all-communities"
            icon="stateCommunities"
          />
          <NavItem
            className={styles.item}
            label="Create a DAO"
            href="/create-dao"
            icon="stateCreateDao"
          />
        </nav>
        {/* todo - check if the user is logged in from auth service */}
        <AppFooter isLoggedIn />
      </div>
    </aside>
  );
};

Sidebar.defaultProps = {
  className: '',
  fullscreen: false,
  closeSideBar: undefined
};
