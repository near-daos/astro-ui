import cn from 'classnames';
import { useRouter } from 'next/router';
import React, { forwardRef, useCallback } from 'react';
import { useTranslation } from 'next-i18next';

import {
  ALL_DAOS_URL,
  ALL_FEED_URL,
  CREATE_DAO_URL,
  MY_DAOS_URL,
  MY_FEED_URL,
} from 'constants/routing';

import { useWalletContext } from 'context/WalletContext';
import { useDaoIds } from 'hooks/useDaoIds';

import { Logo } from 'components/Logo';
import { Icon } from 'components/Icon';
import { AppFooter } from 'astro_2.0/components/AppFooter';
import { WalletType } from 'types/config';
import { NavItem } from './components/NavItem';

import styles from './Sidebar.module.scss';

interface SidebarProps {
  className?: string;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>((props, ref) => {
  const { className } = props;

  const router = useRouter();
  const { t } = useTranslation();

  const { accountId, login } = useWalletContext();
  const myDaosIds = useDaoIds(accountId);

  const createDao = useCallback(() => {
    const url = { pathname: CREATE_DAO_URL, query: { step: 'info' } };

    return accountId
      ? router.push(url)
      : login(WalletType.NEAR).then(() => router.push(url));
  }, [login, router, accountId]);

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
