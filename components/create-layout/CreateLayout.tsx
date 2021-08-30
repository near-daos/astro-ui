import { AppHeader } from 'components/AppHeader';
import React, { FC } from 'react';

import styles from './create-layout.module.scss';

const CreateLayout: FC = ({ children }) => {
  return (
    <div className={styles.root}>
      <AppHeader />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default CreateLayout;
