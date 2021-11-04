import uniqid from 'uniqid';
import classNames from 'classnames';
import { useToggle } from 'react-use';
import { useFormContext } from 'react-hook-form';
import React, { FC, useState } from 'react';

import { Icon } from 'components/Icon';
import { DaoImageType } from 'astro_2.0/features/CreateDao/components/types';

import { getImageFromImageFileList } from 'utils/getImageFromImageFileList';

import styles from './ImageUpload.module.scss';

export interface ImageUploadProps {
  fieldName: DaoImageType;
}

export const ImageUpload: FC<ImageUploadProps> = ({ fieldName }) => {
  const { watch, register } = useFormContext();

  const imageFileList = watch(fieldName);

  const [id] = useState(uniqid());

  const [show, toggleShow] = useToggle(false);
  const uploadText = imageFileList?.length
    ? 'Click here to upload image'
    : 'Click here to change image';

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
