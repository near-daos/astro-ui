import React from 'react';

import { FlagImage } from 'astro_2.0/features/CreateDao/components/FlagImage/FlagImage';
import { FlagPreview } from 'astro_2.0/features/CreateDao/components/FlagPreview/FlagPreview';

import styles from './DaoFlagForm.module.scss';

export function DaoFlagForm(): JSX.Element {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2>Lets create your flag!</h2>
        <p>
          Both fields are optional. If&nbsp;you skip, default image will
          be&nbsp;used instead. An&nbsp;image and a&nbsp;logo together form
          a&nbsp;flag of&nbsp;your DAO!
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.cover}>
          <FlagImage
            title="Upload your “Cover”"
            description="Cover will be used as a branded letterhead of your proposals, also small icon of your flag won’t include logo on it."
            requirements="Rectangular image 3x4 proportions"
            fieldName="flagCover"
          />
        </div>
        <div className={styles.logo}>
          <FlagImage
            title="Upload your “Logo”"
            description="Logo will be placed on top of your flag and will be visible on your full view DAO details."
            requirements="Square image, 400x400 pixels"
            fieldName="flagLogo"
          />
        </div>
        <div className={styles.preview}>
          <FlagPreview />
        </div>
      </div>
    </div>
  );
}
