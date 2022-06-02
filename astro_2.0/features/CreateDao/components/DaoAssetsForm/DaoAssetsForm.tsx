import React, { useCallback, VFC } from 'react';
import { useTranslation } from 'next-i18next';
import { useStateMachine } from 'little-state-machine';
import { useForm, FormProvider } from 'react-hook-form';
import { useMount } from 'react-use';
import * as yup from 'yup';
import cn from 'classnames';

import { useModal } from 'components/modal';
import { updateAction } from 'astro_2.0/features/CreateDao/components/helpers';
import { Icon } from 'components/Icon';
import { DaoLogo } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLogo';
import { Button } from 'components/button/Button';
import { ImageUpload } from 'astro_2.0/features/CreateDao/components/ImageUpload';
import { DaoSubmitForm } from 'astro_2.0/features/CreateDao/components/DaoSubmitForm';
import { PreviewModal } from 'astro_2.0/features/CreateDao/components/PreviewModal';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import { StepCounter } from 'astro_2.0/features/CreateDao/components/StepCounter';

import { useImageUpload } from 'astro_2.0/features/CreateDao/components/hooks';
import { getAwsImageUrl } from 'services/sputnik/mappers/utils/getAwsImageUrl';
import { getImgValidationError, validateImgSize } from 'utils/imageValidators';

import styles from './DaoAssetsForm.module.scss';

const schema = yup.object().shape({
  value: yup.mixed().test('fileSize', getImgValidationError, validateImgSize),
});

async function validateAsset(data: { value: FileList }) {
  try {
    await schema.validate(data, {
      abortEarly: false,
    });

    return {
      values: { value: data.value },
      errors: null,
    };
  } catch (e) {
    return {
      values: null,
      errors: e.inner.reduce(
        (
          allErrors: Record<string, string>,
          currentError: { path: string; type?: string; message: string }
        ) => {
          return {
            ...allErrors,
            value: {
              type: currentError.type ?? 'validation',
              message: currentError.message,
            },
          };
        },
        {}
      ),
    };
  }
}

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

  function renderError(err?: string) {
    if (!err) {
      return null;
    }

    return (
      <Tooltip overlay={<div className={styles.tooltip}>{err}</div>}>
        <div>
          <Icon name="info" className={styles.errorInfo} />
        </div>
      </Tooltip>
    );
  }

  return (
    <>
      <FormProvider {...methods}>
        <form className={styles.root}>
          <div className={styles.header}>
            <h2>{t('createDAO.daoAssets.createDaoAssets')}</h2>
            <StepCounter total={8} current={8} />
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
                  const res = await validateAsset({ value });

                  if (res.errors) {
                    methods.setError('flagLogo', res.errors.value);
                  } else if (res.values) {
                    methods.clearErrors('flagLogo');

                    const fileName = await uploadImage(value[0]);

                    actions.updateAction({
                      assets: { ...state.assets, flagLogo: fileName },
                    });
                  }
                }}
                control={
                  <div className={styles.uploadControl}>
                    <Icon
                      name="buttonEdit"
                      className={cn(styles.uploadIcon, {
                        [styles.error]: !!methods.formState.errors.flagLogo,
                      })}
                    />
                  </div>
                }
              />
              {methods.formState.errors.flagLogo &&
                renderError(methods.formState.errors.flagLogo.message)}
            </div>

            <div className={styles.coverEdit}>
              <ImageUpload
                fieldName="flagCover"
                showPreview={false}
                className={styles.uploader}
                onSelect={async value => {
                  const res = await validateAsset({ value });

                  if (res.errors) {
                    methods.setError('flagCover', res.errors.value);
                  } else if (res.values) {
                    methods.clearErrors('flagCover');

                    const fileName = await uploadImage(value[0]);

                    actions.updateAction({
                      assets: { ...state.assets, flagCover: fileName },
                    });
                  }
                }}
                control={
                  <div className={styles.uploadControl}>
                    <Icon
                      name="buttonEdit"
                      className={cn(styles.uploadIcon, {
                        [styles.error]: !!methods.formState.errors.flagCover,
                      })}
                    />
                  </div>
                }
              />
              {methods.formState.errors.flagCover &&
                renderError(methods.formState.errors.flagCover.message)}
            </div>
          </section>

          <div className={styles.preview}>
            <Button
              variant="secondary"
              size="small"
              onClick={handleAssetsPreview}
              className={styles.previewButton}
            >
              Preview Flag & Letterhead
            </Button>
          </div>
        </form>
      </FormProvider>
      <DaoSubmitForm />
    </>
  );
};
