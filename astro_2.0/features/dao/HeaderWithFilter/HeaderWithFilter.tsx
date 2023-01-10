import cn from 'classnames';
import { FC, MutableRefObject, ReactNode, PropsWithChildren } from 'react';

import styles from './HeaderWithFilter.module.scss';

interface HeaderWithFilterProps extends PropsWithChildren {
  title?: ReactNode;
  className?: string;
  classNameContainer?: string;
  classNameTitle?: string;
  titleRef?: MutableRefObject<HTMLDivElement | null>;
}

export const HeaderWithFilter: FC<HeaderWithFilterProps> = ({
  title,
  children,
  className,
  classNameContainer,
  classNameTitle,
  titleRef,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div
        className={cn(styles.headerContainer, classNameTitle)}
        ref={titleRef}
      >
        {title}
      </div>
      <div className={cn(styles.filtersContainer, classNameContainer)}>
        {children}
      </div>
    </div>
  );
};
