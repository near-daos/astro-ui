import React, { useEffect, useState, VFC } from 'react';
import { SputnikHttpService } from 'services/sputnik';

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
  const [myDaosIds, setMyDaosIds] = useState<string[]>([]);
  const { accountId } = useAuthContext();

  useEffect(() => {
    async function getMyDaosIds() {
      if (accountId) {
        const accountDaosIds = await SputnikHttpService.getAccountDaosIds(
          accountId
        );

        setMyDaosIds(accountDaosIds);
      }
    }

    getMyDaosIds();
  }, [accountId]);

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
    return (
      <NavButton {...conf} mobile myDaosIds={myDaosIds} key={conf.label} />
    );
  });

  return <div className={styles.root}>{navItems}</div>;
};
