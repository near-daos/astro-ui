import React, { FC } from 'react';

import styles from './ContentPanel.module.scss';

interface ContentPanelProps {
  title: string;
}

export const ContentPanel: FC<ContentPanelProps> = ({ children, title }) => {
  return (
    <>
      <div className={styles.title}>{title}</div>
      {children}
    </>
  );
};
