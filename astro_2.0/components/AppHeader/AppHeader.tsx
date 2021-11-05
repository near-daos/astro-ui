import cn from 'classnames';
import React, { FC, useState } from 'react';

import { Icon } from 'components/Icon';

import { NAV_CONFIG } from 'astro_2.0/components/navigation/navConfig';

import { NavButton } from 'astro_2.0/components/navigation/NavButton';

import { SearchBar } from './components/SearchBar';
import { AccountButton } from './components/AccountButton';

import styles from './AppHeader.module.scss';

export const AppHeader: FC = () => {
  const [searchExpanded, setSearchExpanded] = useState(false);

  const rootClassName = cn(styles.root, {
    [styles.searchExpanded]: searchExpanded,
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

  function renderNav() {
    const navItems = NAV_CONFIG.map(conf => {
      const { icon, href, label, hoverIcon } = conf;

      return (
        <NavButton icon={icon} hoverIcon={hoverIcon} href={href} key={label}>
          {label}
        </NavButton>
      );
    });

    return <div className={styles.nav}>{navItems}</div>;
  }

  return (
    <header className={rootClassName}>
      {renderLogo()}
      <div className={styles.centralPart}>
        {renderLogo(styles.mobileLogo)}
        {renderNav()}
        <SearchBar
          placeholder="Search"
          className={styles.search}
          onSearchToggle={setSearchExpanded}
        />
      </div>
      <AccountButton />
    </header>
  );
};
