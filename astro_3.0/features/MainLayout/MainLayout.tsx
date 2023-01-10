import React, { FC, PropsWithChildren } from 'react';
import cn from 'classnames';

import { PAGE_LAYOUT_ID } from 'constants/common';

import styles from './MainLayout.module.scss';

interface Props extends PropsWithChildren {
  className?: string;
}

export const MainLayout: FC<Props> = ({ children, className }) => {
  return (
    <div className={cn(styles.root, className)} id={PAGE_LAYOUT_ID}>
      {children}
    </div>
  );
};
