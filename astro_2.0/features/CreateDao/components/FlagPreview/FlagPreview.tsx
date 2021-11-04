import React from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';

import { Icon } from 'components/Icon';

import { getImageFromImageFileList } from 'utils/getImageFromImageFileList';

import styles from './FlagPreview.module.scss';

export function FlagPreview(): JSX.Element {
  const { watch } = useFormContext();

  const coverFileList = watch('flagCover');
  const logoFileList = watch('flagLogo');

  const coverImg = getImageFromImageFileList(coverFileList);
  const logoImg = getImageFromImageFileList(logoFileList);

  return (
    <>
      <div className={styles.root}>
        <div className={styles.header}>
          <h3>Preview of your custom DAO assets</h3>
        </div>

        <div className={styles.titles}>
          <div className={styles.titleOut}>Flag and Icon</div>
          <div className={styles.titleOut}>Letterhead</div>
        </div>

        <div className={styles.preview}>
          <div className={styles.column}>
            <div className={styles.titleIn}>Flag and Icon</div>
            <div className={styles.flags}>
              <div className={cn(styles.flag, styles.sm)}>
                <div className={cn(styles.background, styles.sm)} />
                <div
                  className={cn(styles.cover, styles.sm)}
                  style={{
                    backgroundImage: `url(${coverImg})`,
                  }}
                />
              </div>
              <div className={styles.flag}>
                <div className={styles.background} />
                <div
                  className={styles.cover}
                  style={{
                    backgroundImage: `url(${coverImg})`,
                  }}
                />
                {logoFileList && (
                  <div
                    className={styles.logo}
                    style={{
                      backgroundImage: `url(${logoImg})`,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.titleIn}>Letterhead</div>
            <div className={styles.dummyCard}>
              <div
                className={styles.letterhead}
                style={{
                  backgroundImage: `url(${coverImg})`,
                }}
              >
                <Icon name="proposalBounty" width={24} color="white" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <svg className="svg" width="0" height="0">
        <clipPath id="flag">
          <path d="M240.01 0L50.4101 67.7595V105.35L0 123.366V272L189.599 204.24V166.65L240.01 148.634V0Z" />
        </clipPath>
        <clipPath id="small-flag">
          <path d="M42.0004 0L8.8218 11.4593V17.8164L0 20.8633V45.9999L33.1786 34.5406V28.1835L42.0004 25.1366V0Z" />
        </clipPath>
      </svg>
    </>
  );
}
