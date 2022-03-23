import React, { useCallback, VFC } from 'react';
import { useTranslation } from 'next-i18next';
import { useStateMachine } from 'little-state-machine';
import { useForm, FormProvider } from 'react-hook-form';
import { useMount } from 'react-use';

import { useModal } from 'components/modal';
import { updateAction } from 'astro_2.0/features/CreateDao/components/helpers';
import { Icon } from 'components/Icon';
import { DaoLogo } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLogo';
import { Button } from 'components/button/Button';
import { ImageUpload } from 'astro_2.0/features/CreateDao/components/ImageUpload';
import { DaoSubmitForm } from 'astro_2.0/features/CreateDao/components/DaoSubmitForm';
import { PreviewModal } from 'astro_2.0/features/CreateDao/components/PreviewModal';

import { useImageUpload } from 'astro_2.0/features/CreateDao/components/hooks';
import { getAwsImageUrl } from 'services/sputnik/mappers/utils/getAwsImageUrl';

import styles from './DaoAssetsForm.module.scss';

export const DaoAssetsForm: VFC = () => {
  const { t } = useTranslation();
  const { uploadImage } = useImageUpload();
  const { actions, state } = useStateMachine({ updateAction });
  const [showModal] = useModal(PreviewModal);

  const methods = useForm<{
    flagCover: FileList;
    flagLogo: FileList;
    defaultFlag: string;
  }>({
    mode: 'onChange',
  });

  const coverImg = getAwsImageUrl(state.assets.flagCover);
  const logoImg = getAwsImageUrl(state.assets.flagLogo);

  const handleAssetsPreview = useCallback(async () => {
    await showModal({
      cover: coverImg || '/flags/defaultDaoFlag.png',
      logo: logoImg,
    });
  }, [coverImg, logoImg, showModal]);

  useMount(() => {
    actions.updateAction({
      assets: { ...state.assets, isValid: true },
    });
  });

  return (
    <>
      <FormProvider {...methods}>
        <form className={styles.root}>
          <div className={styles.header}>
            <h2>{t('createDAO.daoAssets.createDaoAssets')}</h2>
          </div>
          <p className={styles.description}>
            {t('createDAO.daoAssets.createDaoAssetsDescription')}
          </p>

          <section
            className={styles.letterHeadSection}
            style={{
              backgroundImage: `url(${
                coverImg || '/flags/defaultDaoFlag.png'
              })`,
            }}
          >
            <DaoLogo src={logoImg} className={styles.logo} />

            <div className={styles.logoEdit}>
              <ImageUpload
                fieldName="flagLogo"
                showPreview={false}
                className={styles.uploader}
                onSelect={async value => {
                  const fileName = await uploadImage(value[0]);

                  actions.updateAction({
                    assets: { ...state.assets, flagLogo: fileName },
                  });
                }}
                control={
                  <div className={styles.uploadControl}>
                    <Icon name="buttonEdit" className={styles.uploadIcon} />
                  </div>
                }
              />
            </div>

            <div className={styles.coverEdit}>
              <ImageUpload
                fieldName="flagCover"
                showPreview={false}
                className={styles.uploader}
                onSelect={async value => {
                  const fileName = await uploadImage(value[0]);

                  actions.updateAction({
                    assets: { ...state.assets, flagCover: fileName },
                  });
                }}
                control={
                  <div className={styles.uploadControl}>
                    <Icon name="buttonEdit" className={styles.uploadIcon} />
                  </div>
                }
              />
            </div>
          </section>

          <div className={styles.preview}>
            <Button
              variant="secondary"
              size="small"
              onClick={handleAssetsPreview}
              className={styles.previewButton}
            >
              Preview Flag and Letterhead
            </Button>
          </div>
        </form>
      </FormProvider>
      <DaoSubmitForm />
    </>
  );
};
