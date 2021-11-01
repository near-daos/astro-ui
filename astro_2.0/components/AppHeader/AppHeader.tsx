import cn from 'classnames';
import React, { FC } from 'react';

import { ALL_DAOS_URL, ALL_FEED_URL } from 'constants/routing';

import { NavButton } from './components/NavButton';
import { SearchBar } from './components/SearchBar';
import { AccountButton } from './components/AccountButton';

import styles from './AppHeader.module.scss';

export const AppHeader: FC = () => {
  return (
    <header className={styles.root}>
      <div className={styles.section}>
        <NavButton href={ALL_DAOS_URL}>All DAOs</NavButton>
        <NavButton href={ALL_FEED_URL}>Astro Feed</NavButton>
      </div>
      <div className={cn(styles.section, styles.search)}>
        <SearchBar placeholder="Search" />
      </div>
      <div className={styles.section}>
        <AccountButton />
      </div>
    </header>
  );
};
