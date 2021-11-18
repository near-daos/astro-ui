import React, { FC } from 'react';
import { Icon } from 'components/Icon';

import styles from './LoadingIndicator.module.scss';

export const LoadingIndicator: FC = () => {
  return (
    <div className={styles.root}>
      <Icon name="loading" className={styles.icon} />
    </div>
  );
};
