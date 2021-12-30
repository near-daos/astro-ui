import React from 'react';
import { useTranslation } from 'next-i18next';

import cn from 'classnames';
import { Icon } from 'components/Icon';
import { FlagRenderer } from 'astro_2.0/components/Flag';
import styles from './FlagPreview.module.scss';

interface FlagPreviewProps {
  coverFile: string;
  logoFile: string;
}

export const FlagPreview: React.FC<FlagPreviewProps> = ({
  coverFile,
  logoFile,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.root}>
        <div className={styles.header}>
          <h3>{t('createDAO.daoPreviewForm.daoPreviewHeader')}</h3>
        </div>

        <div className={styles.titles}>
          <div className={styles.titleOut}>
            {t('createDAO.daoPreviewForm.daoPreviewFlagAndIcon')}
          </div>
          <div className={styles.titleOut}>
            {t('createDAO.daoPreviewForm.daoPreviewLetterhead')}
          </div>
        </div>

        <div className={styles.preview}>
          <div className={styles.column}>
            <div className={styles.titleIn}>
              {t('createDAO.daoPreviewForm.daoPreviewFlagAndIcon')}
            </div>
            <div className={styles.flags}>
              <div className={cn(styles.flag, styles.sm)}>
                <FlagRenderer key={coverFile} flag={coverFile} size="sm" />
              </div>
              <div className={styles.flag}>
                <FlagRenderer
                  key={coverFile}
                  flag={coverFile}
                  size="lg"
                  logo={logoFile}
                />
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.titleIn}>
              {t('createDAO.daoPreviewForm.daoPreviewLetterhead')}
            </div>
            <div className={styles.dummyCard}>
              <div
                key={coverFile}
                className={styles.letterhead}
                style={{
                  backgroundImage: `url(${coverFile})`,
                }}
              >
                <Icon name="proposalBounty" width={24} color="white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
