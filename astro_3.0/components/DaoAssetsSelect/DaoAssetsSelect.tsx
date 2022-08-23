import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';

import { ImageUpload } from 'astro_2.0/features/CreateDao/components/ImageUpload';
import { validateAsset } from 'astro_2.0/features/CreateDao/components/ImageUpload/helpers';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { AppLogoSelector } from 'astro_3.0/components/AppLogoSelector';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { getImageFromImageFileList } from 'utils/getImageFromImageFileList';

import { DAO } from 'types/dao';

import styles from './DaoAssetsSelect.module.scss';

interface Props {
  dao: DAO;
}

export const DaoAssetsSelect: FC<Props> = ({ dao }) => {
  const { watch, setValue } = useFormContext();

  const cover = watch('flagCover');
  const flagLogo = watch('flagLogo');

  const backgroundImageStyles = useMemo(() => {
    if (cover && cover.length) {
      return {
        backgroundImage: `url(${getImageFromImageFileList(cover)})`,
      };
    }

    return {
      backgroundImage: dao.flagCover ? `url(${dao.flagCover})` : 'none',
    };
  }, [cover, dao.flagCover]);

  const logo = useMemo(() => {
    if (flagLogo && flagLogo[0]) {
      return (
        <div
          className={styles.logo}
          style={{
            backgroundSize: flagLogo[0].name?.startsWith('avatar')
              ? '105% 105%'
              : 'cover',
            backgroundImage: `url(${getImageFromImageFileList(flagLogo)})`,
          }}
        />
      );
    }

    if (dao.flagLogo) {
      return (
        <div
          className={styles.logo}
          style={{ backgroundImage: `url(${dao.flagLogo})` }}
        />
      );
    }

    return (
      <div
        className={styles.logo}
        style={{
          backgroundSize: '105% 105%',
          backgroundImage: `url(/avatars/avatar1.png)`,
        }}
      />
    );
  }, [flagLogo, dao.flagLogo]);

  return (
    <div className={styles.root}>
      <section
        className={cn(styles.letterHeadSection, styles.fullWidth)}
        style={backgroundImageStyles}
      >
        <div className={styles.editCover}>
          <ImageUpload
            fieldName="flagCover"
            showPreview={false}
            className={styles.uploader}
            onSelect={async value => {
              const res = await validateAsset({ value });

              if (res.errors) {
                showNotification({
                  type: NOTIFICATION_TYPES.ERROR,
                  description: res.errors.value.message
                    ? (res.errors?.value?.message as string)
                    : 'Error uploading image',
                  lifetime: 20000,
                });
                setValue('flagCover', null);
              }
            }}
            control={
              <div className={styles.uploadControl}>
                <Icon name="buttonEdit" className={cn(styles.uploadIcon)} />
              </div>
            }
          />
        </div>
        <Button
          variant="transparent"
          size="block"
          onClick={() => {
            setValue('flagLogo', '', { shouldDirty: true });
          }}
        >
          <div className={cn(styles.logoControl)}>
            {logo}
            <div className={styles.logoOverlay}>
              <Icon name="camera" className={styles.overlayIcon} />
              <div className={styles.overlayText}>Change Logo</div>
            </div>
          </div>
        </Button>
      </section>
      <section className={styles.appLogoSelectorWrapper}>
        <AppLogoSelector />
      </section>
    </div>
  );
};
