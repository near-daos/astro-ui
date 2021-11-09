import React, { FC, useState } from 'react';
import { useToggle } from 'react-use';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';
import uniqid from 'uniqid';

import { DaoImageType } from 'astro_2.0/features/CreateDao/components/types';
import { Icon } from 'components/Icon';
import { getImageFromImageFileList } from 'utils/getImageFromImageFileList';

import styles from './ImageUpload.module.scss';

export interface ImageUploadProps {
  fieldName: DaoImageType;
}

export const ImageUpload: FC<ImageUploadProps> = ({ fieldName }) => {
  const { watch, register } = useFormContext();

  const imageFileList = watch(fieldName);
  const isImageUploaded = imageFileList?.length;

  const [id] = useState(uniqid());

  const [show, toggleShow] = useToggle(false);
  const uploadText = isImageUploaded
    ? 'Click here to change image'
    : 'Click here to upload image';

  return (
    <div
      className={styles.root}
      onMouseEnter={toggleShow}
      onMouseLeave={toggleShow}
    >
      <input
        id={id}
        type="file"
        {...register(fieldName)}
        className={styles.uploadInput}
        accept="image/gif, image/jpeg, image/png"
      />
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
