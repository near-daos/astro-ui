import { FC, PropsWithChildren } from 'react';
import cn from 'classnames';

import styles from './SubHeader.module.scss';

interface SubHeaderProps extends PropsWithChildren {
  className?: string;
}

export const SubHeader: FC<SubHeaderProps> = props => {
  const { className, children } = props;

  return <h2 className={cn(styles.root, className)}>{children}</h2>;
};
