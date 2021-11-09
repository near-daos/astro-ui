import React, { FC } from 'react';

import { NotificationContainer } from 'features/notifications';

import styles from './CreateLayout.module.scss';

const CreateLayout: FC = ({ children }) => {
  return (
    <div className={styles.root}>
      <main className={styles.main}>{children}</main>
      <NotificationContainer />
    </div>
  );
};

export default CreateLayout;
