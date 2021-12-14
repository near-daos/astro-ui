import React from 'react';
import { NextPage } from 'next';

import { CreateDao } from 'astro_2.0/features/CreateDao';

import styles from './CreateDaoPage.module.scss';

const CreateDaoPage: NextPage<{ step: string }> = () => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.breadcrumbs}>Create new DAO</div>
        <div className={styles.header}>
          <h1>
            A&nbsp;DAO is&nbsp;a&nbsp;new way for people to&nbsp;organize and
            work together.
          </h1>
        </div>
        <CreateDao />
      </div>
    </div>
  );
};

export default CreateDaoPage;
