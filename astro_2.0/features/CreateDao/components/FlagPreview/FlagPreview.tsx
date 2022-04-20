import React from 'react';
import { useTranslation } from 'next-i18next';

import cn from 'classnames';
import { Icon } from 'components/Icon';
import { FlagRenderer } from 'astro_2.0/components/Flag';
import { DaoLogo } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLogo';

import styles from './FlagPreview.module.scss';

interface FlagPreviewProps {
  coverFile?: string;
  logoFile?: string;
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
            {t('createDAO.daoPreviewForm.daoDashboard')}
          </div>
        </div>

        <div className={styles.dashboardPreview}>
          <section
            className={styles.letterHeadSection}
            style={{
              backgroundImage: `url(${
                coverFile || '/flags/defaultDaoFlag.png'
              })`,
            }}
          >
            <DaoLogo src={logoFile} className={styles.logoDashboard} />
          </section>
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
                <FlagRenderer key={logoFile} flag={logoFile} size="sm" />
              </div>
              <div className={styles.flag}>
                <FlagRenderer key={logoFile} flag={logoFile} size="lg" />
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
