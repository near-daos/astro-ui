import React, { FC, PropsWithChildren } from 'react';

import styles from './FeedControlsLayout.module.scss';

export const FeedControlsLayout: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.root}>{children}</div>;
};
