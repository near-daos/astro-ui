import cn from 'classnames';
import { FC, MutableRefObject, ReactNode } from 'react';

import styles from './HeaderWithFilter.module.scss';

interface HeaderWithFilterProps {
  title?: ReactNode;
  className?: string;
  titleRef?: MutableRefObject<HTMLDivElement | null>;
}

export const HeaderWithFilter: FC<HeaderWithFilterProps> = ({
  title,
  children,
  className,
  titleRef,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.headerContainer} ref={titleRef}>
        {title}
      </div>
      <div className={styles.filtersContainer}>{children}</div>
    </div>
  );
};
