import React, { FC, ReactNode } from 'react';

import styles from './NoResultsView.module.scss';

interface NoResultsViewProps {
  title: ReactNode;
  subTitle?: string;
}

export const NoResultsView: FC<NoResultsViewProps> = ({ title, subTitle }) => {
  return (
    <div className={styles.root}>
      <div className={styles.image} />
      <div className={styles.title}>{title}</div>
      <div className={styles.desc}>{subTitle}</div>
    </div>
  );
};
