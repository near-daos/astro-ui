import cn from 'classnames';
import React, { FC } from 'react';

import styles from './AccountPopupItem.module.scss';

interface AccountPopupItemProps {
  className?: string;
  onClick?: () => void;
}

export const AccountPopupItem: FC<AccountPopupItemProps> = ({
  className,
  children,
  onClick,
}) => {
  return (
    <div
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyPress={onClick}
      className={cn(styles.root, className)}
    >
      {children}
    </div>
  );
};
