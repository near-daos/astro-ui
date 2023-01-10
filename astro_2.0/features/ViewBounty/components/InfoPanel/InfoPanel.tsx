import React, { FC, PropsWithChildren } from 'react';

import styles from './InfoPanel.module.scss';

export const InfoPanel: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.root}>{children}</div>;
};
