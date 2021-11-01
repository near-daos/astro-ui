import React from 'react';
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
        <p>Upload your “Cover”</p>
        <p>Upload your Logo</p>
        <p>Preview of your custom DAO assets</p>
      </div>
    </div>
  );
}
