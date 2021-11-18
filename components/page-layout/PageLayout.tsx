import cn from 'classnames';
import React, { FC } from 'react';
import { useRouter } from 'next/router';

import { CREATE_DAO_URL } from 'constants/routing';

import { Sidebar } from 'components/Sidebar';
import { AppHeader } from 'astro_2.0/components/AppHeader';
import { LinkToTop } from 'astro_2.0/components/LinkToTop';
import { NotificationContainer } from 'features/notifications';

import styles from './PageLayout.module.scss';

const PageLayout: FC = ({ children }) => {
  const router = useRouter();

  const isCreateDaoPage = router.route.match(CREATE_DAO_URL);

  const rootClassName = cn(styles.root, {
    [styles.createDao]: isCreateDaoPage,
  });

  return (
    <div className={rootClassName}>
      <Sidebar />
      <div className={styles.content}>
        <AppHeader />
        <div className={styles.main}>{children}</div>
        <LinkToTop />
      </div>
      <NotificationContainer />
    </div>
  );
};

export default PageLayout;
