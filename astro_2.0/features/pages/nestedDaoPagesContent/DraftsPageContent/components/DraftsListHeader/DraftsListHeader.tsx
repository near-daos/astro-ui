import React, { FC } from 'react';
import styles from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/DraftsPageContent.module.scss';
import { useTranslation } from 'next-i18next';

export const DraftsListHeader: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.listHeader}>
      <div className={styles.status}>&nbsp;</div>
      <div className={styles.columns}>
        <div className={styles.title}>{t('drafts.topic')}</div>
        <div className={styles.views}>{t('drafts.views')}</div>
        <div className={styles.replies}>{t('drafts.replies')}</div>
        <div className={styles.updated}>{t('drafts.lastActivity')}</div>
      </div>
    </div>
  );
};
