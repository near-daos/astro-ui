import cn from 'classnames';
import React, { FC, useRef } from 'react';

import { NavItemProps } from 'astro_2.0/components/navigation/types';

import {
  MY_DAOS_NAV_CONFIG,
  MY_FEED_NAV_CONFIG,
  ALL_DAOS_NAV_CONFIG,
  ASTRO_FEED_NAV_CONFIG,
  CREATE_DAO_NAV_CONFIG,
} from 'astro_2.0/components/navigation/navConfig';

import { Icon } from 'components/Icon';

import { NavButton } from 'astro_2.0/components/navigation/NavButton';

import { SearchBar } from './components/SearchBar';
import { AccountButton } from './components/AccountButton';

import styles from './AppHeader.module.scss';

export const AppHeader: FC = () => {
  const withSideBar = true;
  const centralEl = useRef(null);

  const rootClassName = cn(styles.root, {
    [styles.withSideBar]: withSideBar,
  });

  function renderLogo(className?: string) {
    return (
      <a
        href="https://astrodao.com/"
        target="_blank"
        rel="noreferrer"
        className={cn(styles.logo, className)}
      >
        <Icon width={100} name="appLogo" />
      </a>
    );
  }

  function renderNavItem(conf: NavItemProps) {
    return <NavButton {...conf} key={conf.label} className={styles.navItem} />;
  }

  return (
    <header className={rootClassName}>
      {renderLogo()}
      <div className={styles.centralPart} ref={centralEl}>
        {renderLogo(styles.mobileLogo)}
        <div className={styles.nav}>
          {renderNavItem(ALL_DAOS_NAV_CONFIG)}
          {renderNavItem(ASTRO_FEED_NAV_CONFIG)}
        </div>
        <SearchBar
          withSideBar
          placeholder="Search"
          prentElRef={centralEl}
          className={styles.search}
        />
        <div className={styles.nav}>
          {renderNavItem(MY_DAOS_NAV_CONFIG)}
          {renderNavItem(MY_FEED_NAV_CONFIG)}
          {renderNavItem(CREATE_DAO_NAV_CONFIG)}
        </div>
      </div>
      <AccountButton />
    </header>
  );
};
