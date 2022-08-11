import React, { FC } from 'react';

import styles from './FeedControlsLayout.module.scss';

export const FeedControlsLayout: FC = ({ children }) => {
  return <div className={styles.root}>{children}</div>;
};
