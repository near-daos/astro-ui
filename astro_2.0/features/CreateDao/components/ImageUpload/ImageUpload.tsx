import uniqid from 'uniqid';
import get from 'lodash/get';
import classNames from 'classnames';
import { useToggle } from 'react-use';
import { useFormContext } from 'react-hook-form';
import React, { FC, useState } from 'react';

import { Icon } from 'components/Icon';
import { DaoImageType } from 'astro_2.0/features/CreateDao/components/types';

import { getImageFromImageFile } from 'utils/getImageFromImageFile';

import styles from './ImageUpload.module.scss';

export interface ImageUploadProps {
  fieldName: DaoImageType;
}

export const ImageUpload: FC<ImageUploadProps> = ({ fieldName }) => {
  const { watch, register } = useFormContext();

  const image = get(watch(fieldName), '0');

  const [id] = useState(uniqid());

  const [show, toggleShow] = useToggle(false);
  const uploadText = image
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
        style={{ backgroundImage: `url(${getImageFromImageFile(image)})` }}
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
