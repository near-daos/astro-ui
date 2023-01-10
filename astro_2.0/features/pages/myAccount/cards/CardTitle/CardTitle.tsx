import { FC, PropsWithChildren } from 'react';
import cn from 'classnames';

import styles from './CardTitle.module.scss';

interface CardTitleProps extends PropsWithChildren {
  className?: string;
}

export const CardTitle: FC<CardTitleProps> = props => {
  const { children, className } = props;

  return <div className={cn(styles.root, className)}>{children}</div>;
};
