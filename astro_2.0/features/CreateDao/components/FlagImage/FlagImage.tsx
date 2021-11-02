import React, { FC } from 'react';
import { ImageUpload } from 'astro_2.0/features/CreateDao/components/ImageUpload/ImageUpload';
import { DAO_IMAGE_DATA } from 'astro_2.0/features/CreateDao/components/units/data';
import { DaoImageType } from 'astro_2.0/features/CreateDao/components/units/types';
import styles from './FlagImage.module.scss';

export interface FlagImageProps {
  type: DaoImageType;
}

export const FlagImage: FC<FlagImageProps> = ({ type }) => {
  const { title, description, requirements } = DAO_IMAGE_DATA[type];

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className={styles.content}>
        <ImageUpload type={type} />
        <div>{requirements}</div>
      </div>
    </div>
  );
};
