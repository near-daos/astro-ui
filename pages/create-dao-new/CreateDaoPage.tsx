import React from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';

import { CreateDao } from 'astro_2.0/features/CreateDao';

import styles from './CreateDaoPage.module.scss';

const CreateDaoPage: NextPage<{ step: string }> = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.breadcrumbs}>
          {t('createDAONew.createNewDAO')}
        </div>
        <div className={styles.header}>
          <h1>{t('createDAONew.createNewDAOWay')}</h1>
        </div>
        <CreateDao />
      </div>
    </div>
  );
};

export default CreateDaoPage;
