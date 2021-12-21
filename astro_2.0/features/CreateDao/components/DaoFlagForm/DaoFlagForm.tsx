import React from 'react';
import { useTranslation } from 'next-i18next';

import { FlagImage } from 'astro_2.0/features/CreateDao/components/FlagImage/FlagImage';

import { FlagPreviewRenderer } from 'astro_2.0/features/CreateDao/components/FlagPreview/FlagPreviewRenderer';
import styles from './DaoFlagForm.module.scss';

export function DaoFlagForm(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2>{t('createDAO.daoFlagForm.daoFlagCreate')}</h2>
        <p>{t('createDAO.daoFlagForm.daoFlagCreateDescription')}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.cover}>
          <FlagImage
            title={t('createDAO.daoFlagForm.daoFlagCoverUpload')}
            description={t(
              'createDAO.daoFlagForm.daoFlagCoverUploadDescription'
            )}
            requirements={t(
              'createDAO.daoFlagForm.daoFlagCoverUploadRequirements'
            )}
            fieldName="flagCover"
          />
        </div>
        <div className={styles.logo}>
          <FlagImage
            title={t('createDAO.daoFlagForm.daoFlagLogoUpload')}
            description={t(
              'createDAO.daoFlagForm.daoFlagLogoUploadDescription'
            )}
            requirements={t(
              'createDAO.daoFlagForm.daoFlagLogoUploadRequirements'
            )}
            fieldName="flagLogo"
          />
        </div>
        <div className={styles.preview}>
          <FlagPreviewRenderer />
        </div>
      </div>
    </div>
  );
}
