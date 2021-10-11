import React, { FC } from 'react';

import styles from './no-results-view.module.scss';

interface NoResultsViewProps {
  title: string;
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
