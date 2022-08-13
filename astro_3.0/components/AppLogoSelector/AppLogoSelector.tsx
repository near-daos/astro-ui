import cn from 'classnames';
import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import { Icon } from 'components/Icon';
import { Caption, Subtitle, Title } from 'components/Typography';
import { Button } from 'components/button/Button';

import { validateAsset } from 'astro_2.0/features/CreateDao/components/ImageUpload/helpers';
import { ImageUpload } from 'astro_2.0/features/CreateDao/components/ImageUpload';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import styles from './AppLogoSelector.module.scss';

const avatars = new Array(15).fill(0).map((item, i) => {
  const name = `avatar${i + 1}.png`;
  const path = `/avatars/${name}`;

  return {
    key: path,
    path,
    name,
    styles: {
      backgroundImage: `url(${path}`,
    },
  };
});

export const AppLogoSelector: FC = () => {
  const { t } = useTranslation();
  const { setValue, watch } = useFormContext();
  const logo = watch('flagLogo');

  return (
    <div className={styles.root}>
      <ImageUpload
        fieldName="flagLogo"
        showPreview={false}
        className={styles.uploader}
        onSelect={async (value, isDrop) => {
          const res = await validateAsset({ value });

          if (res.errors) {
            showNotification({
              type: NOTIFICATION_TYPES.ERROR,
              description: res.errors.value.message
                ? (res.errors?.value?.message as string)
                : 'Error uploading image',
              lifetime: 20000,
            });
            setValue('flagLogo', null);
          } else if (res.values && isDrop) {
            setValue('flagLogo', res.values.value, { shouldDirty: true });
          }
        }}
        control={
          <div className={styles.uploadControl}>
            <Icon name="uploadFile" className={cn(styles.uploadIcon)} />
            <Title size={4}>{t('logoSelector.dropOrBrowse')}</Title>
            <Caption size="small">{t('logoSelector.supportedFormat')}</Caption>
            <Caption size="small">{t('logoSelector.maxSize')}: 200kb</Caption>
          </div>
        }
      />
      <Subtitle size={5} className={styles.subtitle}>
        {t('logoSelector.selectFromTemplate')}
      </Subtitle>
      <div className={styles.logoTemplates}>
        {avatars.map(item => {
          return (
            <Button
              key={item.key}
              variant="transparent"
              size="block"
              onClick={async () => {
                const fileName = item.name;

                fetch(item.path).then(async response => {
                  const contentType = response.headers.get('content-type');
                  const blob = await response.blob();
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  const file = new File([blob], fileName, { contentType });

                  // access file here
                  setValue('flagLogo', [file], { shouldDirty: true });
                });
              }}
            >
              <div
                className={cn(styles.template, {
                  [styles.selected]: logo && logo[0]?.name === item.name,
                })}
                style={item.styles}
              />
            </Button>
          );
        })}
      </div>
    </div>
  );
};
