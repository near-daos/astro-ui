import React, { FC } from 'react';

import { SidebarNavigation } from 'features/sidebar-navigation';

import styles from './page-layout.module.scss';

const PageLayout: FC = ({ children }) => {
  return (
    <div className={styles.root}>
      <SidebarNavigation />
      <header>[PLACEHOLDER] header here</header>
      <main>{children}</main>
    </div>
  );
};

export default PageLayout;
