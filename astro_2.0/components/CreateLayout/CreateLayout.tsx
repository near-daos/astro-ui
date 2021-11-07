import React, { FC } from 'react';

import { NotificationContainer } from 'features/notifications';

import { AppFooter } from 'features/app-footer';
import { AppHeader } from 'astro_2.0/components/AppHeader';

import styles from './CreateLayout.module.scss';

const CreateLayout: FC = ({ children }) => {
  return (
    <div className={styles.root}>
      <AppHeader />
      <main className={styles.main}>{children}</main>
      <NotificationContainer />
      <AppFooter isLandingPage />
    </div>
  );
};

export default CreateLayout;
