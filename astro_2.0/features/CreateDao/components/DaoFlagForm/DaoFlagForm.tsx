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
          <FlagImage type="cover" />
        </div>
        <div className={styles.logo}>
          <FlagImage type="logo" />
        </div>
        <div className={styles.preview}>
          <FlagPreview />
        </div>
      </div>
    </div>
  );
}
