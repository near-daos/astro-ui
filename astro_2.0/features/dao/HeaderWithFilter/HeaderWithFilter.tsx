import cn from 'classnames';
import { FC, ReactNode } from 'react';

import styles from './HeaderWithFilter.module.scss';

interface HeaderWithFilterProps {
  title?: ReactNode;
  className?: string;
}

export const HeaderWithFilter: FC<HeaderWithFilterProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.headerContainer}>{title}</div>
      <div className={styles.filtersContainer}>{children}</div>
    </div>
  );
};
