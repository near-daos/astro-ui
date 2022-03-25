import cn from 'classnames';
import { useRouter } from 'next/router';
import React, { forwardRef, useCallback } from 'react';
import { useTranslation } from 'next-i18next';

import {
  MY_DAOS_URL,
  MY_FEED_URL,
  ALL_DAOS_URL,
  ALL_FEED_URL,
  CREATE_DAO_URL,
  DISCOVER,
} from 'constants/routing';

import { useAuthContext } from 'context/AuthContext';
import { useDaoIds } from 'hooks/useDaoIds';

import { Logo } from 'components/Logo';
import { Icon } from 'components/Icon';
import { AppFooter } from 'astro_2.0/components/AppFooter';
import { NavItem } from './components/NavItem';

import styles from './Sidebar.module.scss';

interface SidebarProps {
  className?: string;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>((props, ref) => {
  const { className } = props;

  const router = useRouter();
  const { t } = useTranslation();

  const { accountId, login } = useAuthContext();
  const myDaosIds = useDaoIds(accountId);

  const createDao = useCallback(
    () => (accountId ? router.push(CREATE_DAO_URL) : login()),
    [login, router, accountId]
  );

  function renderHomeNavItem() {
    if (accountId) {
      return (
        <div>
          <NavItem
            label={t('myDaos')}
            icon="myDaos"
            className={styles.item}
            myDaosIds={myDaosIds}
            href={MY_DAOS_URL}
          />
          <NavItem
            label={t('myFeed')}
            icon="myFeed"
            className={styles.item}
            myDaosIds={myDaosIds}
            href={MY_FEED_URL}
          />
          <div className={styles.divider} />
        </div>
      );
    }

    return null;
  }

  function renderAllCommunities() {
    return (
      <div className={styles.bottom}>
        <NavItem
          label={t('allDaos')}
          icon="allCommunity"
          className={styles.item}
          myDaosIds={myDaosIds}
          href={ALL_DAOS_URL}
        />
        <NavItem
          label={t('discover.title')}
          icon="discover"
          className={styles.item}
          myDaosIds={myDaosIds}
          href={DISCOVER}
        />
        <NavItem
          label={t('globalFeed')}
          icon="globalFeed"
          className={styles.item}
          myDaosIds={myDaosIds}
          href={ALL_FEED_URL}
        />
        <div className={styles.divider} />
      </div>
    );
  }

  return (
    <aside className={cn(styles.sidebar, className)} ref={ref}>
      <div className={styles.wrapper}>
        <Logo className={styles.mainLogo} />
        <div className={styles.subheader}>
          <span>powered by</span>
          <i>
            <Icon name="logoNearFull" width={44} className={styles.logo} />
          </i>
        </div>
        <div className={styles.scrolling}>
          {renderHomeNavItem()}
          {renderAllCommunities()}
          <NavItem
            href={CREATE_DAO_URL}
            urlParams={{ step: 'info' }}
            className={styles.item}
            myDaosIds={myDaosIds}
            onClick={createDao}
            label={t('createNewDao')}
            icon="createNewDao"
          />
        </div>
      </div>
      <AppFooter />
    </aside>
  );
});

Sidebar.defaultProps = {
  className: '',
};
