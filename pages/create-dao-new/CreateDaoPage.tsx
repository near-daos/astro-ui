import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo, useState } from 'react';

import { CreateDao } from 'astro_2.0/features/CreateDao';

import { getRandomInt } from 'utils/getRandomInt';

import styles from './CreateDaoPage.module.scss';

const CreateDaoPage: NextPage<{ step: string }> = () => {
  const { t } = useTranslation();

  const [defaultFlagFile, setDefaultFlagFile] = useState<File>();

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

  useEffect(() => {
    async function loadImage() {
      const response = await fetch(defaultFlag);
      const blob = await response.blob();
      const file = new File([blob], 'image.png', { type: 'image/png' });

      setDefaultFlagFile(file);
    }

    loadImage();
  }, [defaultFlag]);

  return defaultFlagFile ? (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.breadcrumbs}>{t('createDAO.createNewDAO')}</div>
        <div className={styles.header}>
          <h1>{t('createDAO.createNewDAOWay')}</h1>
        </div>
        <CreateDao defaultFlag={defaultFlagFile} />
      </div>
    </div>
  ) : null;
};

export default CreateDaoPage;
