import React, { useCallback, useMemo } from 'react';
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
  function getRandomInt(minNum: number, maxNum: number) {
    const min = Math.ceil(minNum);
    const max = Math.floor(maxNum);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const { t } = useTranslation();

  const getDefaultFlag = useCallback(() => {
    const flags = [
      '/flags/flag-1.svg',
      '/flags/flag-2.svg',
      '/flags/flag-3.svg',
      '/flags/flag-4.svg',
      '/flags/flag-5.svg',
      '/flags/flag-6.svg',
    ];

    return flags[getRandomInt(0, flags.length - 1)];
  }, []);

  const defaultFlag = useMemo(() => getDefaultFlag(), [getDefaultFlag]);

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
                <FlagRenderer flag={coverFile || defaultFlag} size="sm" />
              </div>
              <div className={styles.flag}>
                <FlagRenderer
                  flag={coverFile || defaultFlag}
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
