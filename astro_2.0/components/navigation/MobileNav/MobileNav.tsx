import React, { VFC } from 'react';

import { useWalletContext } from 'context/WalletContext';

import {
  CFC_LIBRARY_NAV_CONFIG,
  MY_DAOS_NAV_CONFIG,
  MY_FEED_NAV_CONFIG,
  ASTRO_FEED_NAV_CONFIG,
  DISCOVER_NAV_CONFIG,
} from 'astro_2.0/components/navigation/navConfig';
import { NavButton } from 'astro_2.0/components/navigation/NavButton';
import { useDaoIds } from 'hooks/useDaoIds';

import styles from './MobileNav.module.scss';

export const MobileNav: VFC = () => {
  const { accountId } = useWalletContext();
  const myDaosIds = useDaoIds(accountId);

  const navConfig = accountId
    ? [
        MY_FEED_NAV_CONFIG,
        MY_DAOS_NAV_CONFIG,
        CFC_LIBRARY_NAV_CONFIG,
        DISCOVER_NAV_CONFIG,
        ASTRO_FEED_NAV_CONFIG,
      ]
    : [DISCOVER_NAV_CONFIG, CFC_LIBRARY_NAV_CONFIG, ASTRO_FEED_NAV_CONFIG];

  const navItems = navConfig.map(conf => {
    return (
      <NavButton {...conf} mobile myDaosIds={myDaosIds} key={conf.label} />
    );
  });

  return <div className={styles.root}>{navItems}</div>;
};
