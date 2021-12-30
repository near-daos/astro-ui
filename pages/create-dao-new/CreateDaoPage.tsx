import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import React, { useMemo } from 'react';

import { CreateDao } from 'astro_2.0/features/CreateDao';

import { getRandomInt } from 'utils/getRandomInt';

import styles from './CreateDaoPage.module.scss';

const CreateDaoPage: NextPage<{ step: string }> = () => {
  const { t } = useTranslation();

  const defaultFlag = useMemo(() => {
    const flags = [
      '/flags/flag-1.png',
      '/flags/flag-2.png',
      '/flags/flag-3.png',
      '/flags/flag-4.png',
      '/flags/flag-5.png',
      '/flags/flag-6.png',
    ];

    return flags[getRandomInt(0, flags.length - 1)];
  }, []);

  return defaultFlag ? (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.breadcrumbs}>{t('createDAO.createNewDAO')}</div>
        <div className={styles.header}>
          <h1>{t('createDAO.createNewDAOWay')}</h1>
        </div>
        <CreateDao defaultFlag={defaultFlag} />
      </div>
    </div>
  ) : null;
};

export default CreateDaoPage;
