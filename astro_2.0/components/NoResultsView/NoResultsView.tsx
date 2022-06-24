import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import styles from './NoResultsView.module.scss';

interface NoResultsViewProps {
  title: ReactNode;
  subTitle?: string;
  className?: string;
  imgClassName?: string;
}

export const NoResultsView: FC<NoResultsViewProps> = ({
  title,
  subTitle,
  className,
  imgClassName,
  children,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={cn(styles.image, imgClassName)} />
      <div className={styles.title}>{title}</div>
      <div className={styles.desc}>{subTitle}</div>
      {children}
    </div>
  );
};
