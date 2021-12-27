import React, { VFC } from 'react';

import { useAuthContext } from 'context/AuthContext';

import {
  ALL_DAOS_NAV_CONFIG,
  MY_DAOS_NAV_CONFIG,
  MY_FEED_NAV_CONFIG,
  ASTRO_FEED_NAV_CONFIG,
  CREATE_DAO_NAV_CONFIG,
} from 'astro_2.0/components/navigation/navConfig';
import { NavButton } from 'astro_2.0/components/navigation/NavButton';

import styles from './MobileNav.module.scss';

export const MobileNav: VFC = () => {
  const { accountId } = useAuthContext();

  const navConfig = accountId
    ? [
        ALL_DAOS_NAV_CONFIG,
        ASTRO_FEED_NAV_CONFIG,
        MY_DAOS_NAV_CONFIG,
        MY_FEED_NAV_CONFIG,
        CREATE_DAO_NAV_CONFIG,
      ]
    : [ALL_DAOS_NAV_CONFIG, ASTRO_FEED_NAV_CONFIG, CREATE_DAO_NAV_CONFIG];

  const navItems = navConfig.map(conf => {
    return <NavButton {...conf} mobile key={conf.label} />;
  });

  return <div className={styles.root}>{navItems}</div>;
};
