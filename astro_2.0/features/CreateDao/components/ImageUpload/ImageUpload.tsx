import uniqid from 'uniqid';
import classNames from 'classnames';
import { useMount, useToggle } from 'react-use';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import React, { PropsWithRef, RefObject, useState } from 'react';

import { DaoImageType } from 'astro_2.0/features/CreateDao/components/types';

import { Icon } from 'components/Icon';
import { InputFormWrapper } from 'components/inputs/InputFormWrapper';

import { getImageFromImageFileList } from 'utils/getImageFromImageFileList';

import styles from './ImageUpload.module.scss';

export interface ImageUploadProps<T extends Element> {
  fieldName: DaoImageType;
  errorElRef?: RefObject<T>;
}

export const ImageUpload = <T extends Element>(
  props: PropsWithRef<ImageUploadProps<T>>
): JSX.Element => {
  const { fieldName, errorElRef } = props;

  const { t } = useTranslation();

  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext();

  const imageFileList = watch(fieldName);
  const isImageUploaded = imageFileList?.length;

  const [id, setId] = useState('');

  useMount(() => {
    setId(uniqid());
  });

  const [show, toggleShow] = useToggle(false);
  const uploadText = isImageUploaded
    ? t('common.clickToChangeImage')
    : t('common.clickToUploadImage');

  function renderInput() {
    const inputEl = (
      <input
        id={id}
        type="file"
        {...register(fieldName)}
        className={styles.uploadInput}
        accept="image/gif, image/jpeg, image/png"
      />
    );

    if (errorElRef?.current) {
      return (
        <InputFormWrapper
          errors={errors}
          errorElRef={errorElRef}
          component={inputEl}
        />
      );
    }

    return inputEl;
  }

  return (
    <div
      className={styles.root}
      onMouseEnter={toggleShow}
      onMouseLeave={toggleShow}
    >
      {renderInput()}
      <div
        className={classNames(styles.image, {
          [styles.logo]: fieldName === 'flagLogo',
        })}
        style={{
          backgroundImage: `url(${getImageFromImageFileList(imageFileList)})`,
        }}
      />
      <label htmlFor={id}>
        <div
          className={classNames(styles.overlay, {
            [styles.clear]: !isImageUploaded,
            [styles.show]: show,
          })}
        >
          <Icon name="upload" width={24} />
          {uploadText}
        </div>
      </label>
    </div>
  );
};
