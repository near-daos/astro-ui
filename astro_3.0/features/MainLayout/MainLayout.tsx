import React, { FC } from 'react';
import cn from 'classnames';

import styles from './MainLayout.module.scss';

interface Props {
  className?: string;
}

export const MainLayout: FC<Props> = ({ children, className }) => {
  return <div className={cn(styles.root, className)}>{children}</div>;
};
