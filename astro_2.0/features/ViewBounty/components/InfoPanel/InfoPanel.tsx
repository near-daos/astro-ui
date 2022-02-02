import React, { FC } from 'react';

import styles from './InfoPanel.module.scss';

export const InfoPanel: FC = ({ children }) => {
  return <div className={styles.root}>{children}</div>;
};
