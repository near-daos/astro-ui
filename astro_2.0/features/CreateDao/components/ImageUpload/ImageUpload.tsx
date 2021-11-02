import React, { FC } from 'react';
import { useToggle } from 'react-use';
import { Icon } from 'components/Icon';
import { DaoImageType } from 'astro_2.0/features/CreateDao/components/units/types';
import classNames from 'classnames';
import styles from './ImageUpload.module.scss';

export interface ImageUploadProps {
  type: DaoImageType;
}

// todo: replace mocked src with uploaded one
const getImageUrl = (imageType: DaoImageType) => {
  switch (imageType) {
    case 'cover':
      return 'https://image.freepik.com/free-photo/blue-liquid-marble-background-abstract-flowing-texture-experimental-art_53876-104502.jpg';
    case 'logo':
      return 'https://s2.coinmarketcap.com/static/img/coins/200x200/11809.png';
    default:
      return '';
  }
};

export const ImageUpload: FC<ImageUploadProps> = ({ type }) => {
  const [show, toggleShow] = useToggle(false);
  const imageUrl = getImageUrl(type);
  const uploadText = imageUrl
    ? 'Click here to change image'
    : 'Click here to upload image';

  return (
    <div
      className={styles.root}
      onMouseEnter={toggleShow}
      onMouseLeave={toggleShow}
    >
      <div
        className={classNames(styles.image, {
          [styles.logo]: type === 'logo',
        })}
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div
        className={classNames(styles.overlay, {
          [styles.show]: show,
        })}
      >
        <Icon name="upload" width={24} />
        {uploadText}
      </div>
    </div>
  );
};
