import cn from 'classnames';
import React, { FC, useState } from 'react';

import {
  ALL_DAOS_URL,
  ALL_FEED_URL,
  CREATE_DAO_URL,
  MY_DAOS_URL,
  MY_FEED_URL,
} from 'constants/routing';

import { Icon } from 'components/Icon';

import { NavButton } from './components/NavButton';
import { SearchBar } from './components/SearchBar';
import { AccountButton } from './components/AccountButton';

import styles from './AppHeader.module.scss';

export const AppHeader: FC = () => {
  const [searchExpanded, setSearchExpanded] = useState(false);

  const rootClassName = cn(styles.root, {
    [styles.searchExpanded]: searchExpanded,
  });

  return (
    <header className={rootClassName}>
      <a
        href="https://astrodao.com/"
        target="_blank"
        rel="noreferrer"
        className={styles.logo}
      >
        <Icon width={100} name="appLogo" />
      </a>
      <div className={styles.centralPart}>
        <div className={styles.nav}>
          <NavButton
            icon="aAllDaos"
            hoverIcon="aAllDaosHover"
            href={ALL_DAOS_URL}
          >
            All DAOs
          </NavButton>
          <NavButton
            icon="aAstroFeed"
            hoverIcon="aAstroFeedHover"
            href={ALL_FEED_URL}
          >
            Astro Feed
          </NavButton>
          <NavButton icon="aMyDaos" hoverIcon="aMyDaosHover" href={MY_DAOS_URL}>
            My DAOs
          </NavButton>
          <NavButton icon="aMyFeed" hoverIcon="aMyFeedHover" href={MY_FEED_URL}>
            My Feed
          </NavButton>
          <NavButton
            icon="aCreateDao"
            hoverIcon="aCreateDaoHover"
            href={CREATE_DAO_URL}
          >
            Create DAO
          </NavButton>
        </div>
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
