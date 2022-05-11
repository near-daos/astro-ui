import React from 'react';
import { useTranslation } from 'next-i18next';

import cn from 'classnames';
import { Icon } from 'components/Icon';
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
        <div className={styles.titles}>
          <div className={styles.titleOut}>
            {t('createDAO.daoPreviewForm.daoPreviewHeader')}
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
                <DaoLogo src={logoFile} size="md" />
              </div>
              <div className={styles.flag}>
                <DaoLogo src={logoFile} />
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
