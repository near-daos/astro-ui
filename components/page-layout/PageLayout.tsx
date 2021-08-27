import React, { FC } from 'react';

import { SidebarNavigation } from 'features/sidebar-navigation';
import { AppHeader } from 'components/AppHeader';

import styles from './page-layout.module.scss';

const PageLayout: FC = ({ children }) => {
  return (
    <div className={styles.root}>
      <SidebarNavigation className={styles.sideBar} />
      <AppHeader />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default PageLayout;
