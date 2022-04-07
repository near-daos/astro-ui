import { FC } from 'react';
import cn from 'classnames';

import styles from './CardLine.module.scss';

interface CardLineProps {
  className?: string;
}

export const CardLine: FC<CardLineProps> = props => {
  const { children, className } = props;

  return <div className={cn(styles.root, className)}>{children}</div>;
};
