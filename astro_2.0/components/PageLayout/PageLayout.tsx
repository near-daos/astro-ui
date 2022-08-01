import cn from 'classnames';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import Tooltip from 'react-tooltip';

import { CREATE_DAO_URL } from 'constants/routing';

import { Sidebar as SidebarNext } from 'astro_3.0/features/Sidebar';
import { Sidebar } from 'components/Sidebar';
import { AppHeader } from 'astro_2.0/components/AppHeader';
import { LinkToTop } from 'astro_2.0/components/LinkToTop';
import { NotificationContainer } from 'features/notifications';

import { useAppVersion } from 'hooks/useAppVersion';

import styles from './PageLayout.module.scss';

export const PageLayout: FC = ({ children }) => {
  const router = useRouter();

  const { appVersion } = useAppVersion();

  const isCreateDaoPage = router.route.match(CREATE_DAO_URL);

  const rootClassName = cn(styles.root, {
    [styles.createDao]: isCreateDaoPage,
  });

  return (
    <div className={rootClassName}>
      {appVersion === 3 ? <SidebarNext /> : <Sidebar />}
      <div className={styles.content}>
        <AppHeader />
        {children}
        <LinkToTop />
      </div>
      <NotificationContainer />
      <Tooltip effect="solid" />
    </div>
  );
};
