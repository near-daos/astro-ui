import cn from 'classnames';
import React, { FC, useRef } from 'react';

import { useRouter } from 'next/router';
import { useAuthContext } from 'context/AuthContext';
import { FEATURE_FLAGS } from 'constants/featureFlags';
import {
  NOTIFICATIONS_PAGE_URL,
  NOTIFICATIONS_SETTINGS_PAGE_URL,
} from 'constants/routing';
import { useAuthContext } from 'context/AuthContext';

import { Icon } from 'components/Icon';
import { SearchBar } from './components/SearchBar';
import { AccountButton } from './components/AccountButton';
import { NotificationsBell } from './components/NotificationsBell';

import styles from './AppHeader.module.scss';

export const AppHeader: FC = () => {
  const router = useRouter();
  const isNotificationsPage =
    router.pathname.includes(NOTIFICATIONS_PAGE_URL) &&
    !router.pathname.includes(NOTIFICATIONS_SETTINGS_PAGE_URL);
  const centralEl = useRef(null);
  const { accountId } = useAuthContext();

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

  const centralPartClassName = cn(styles.centralPart, {
    [styles.withoutNoties]: !FEATURE_FLAGS.NOTIFICATIONS,
  });

  return (
    <header className={styles.root}>
      {renderLogo()}
      <div className={centralPartClassName} ref={centralEl}>
        {renderLogo(styles.mobileLogo)}
        <SearchBar
          withSideBar
          placeholder="Search"
          parentElRef={centralEl}
          className={styles.search}
        />
      </div>
      {!!accountId && !isNotificationsPage && (
        <NotificationsBell className={styles.bell} />
      )}
      <div>
        <AccountButton />
      </div>
    </header>
  );
};
