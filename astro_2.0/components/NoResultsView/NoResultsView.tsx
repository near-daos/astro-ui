import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import styles from './NoResultsView.module.scss';

interface NoResultsViewProps {
  title: ReactNode;
  subTitle?: string;
  className?: string;
}

export const NoResultsView: FC<NoResultsViewProps> = ({
  title,
  subTitle,
  className,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.image} />
      <div className={styles.title}>{title}</div>
      <div className={styles.desc}>{subTitle}</div>
    </div>
  );
};
