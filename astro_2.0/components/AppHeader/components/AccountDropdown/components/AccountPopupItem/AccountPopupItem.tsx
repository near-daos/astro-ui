import cn from 'classnames';
import React, { FC } from 'react';

import styles from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/AccountPopupItem/AccountPopupItem.module.scss';

interface AccountPopupItemProps {
  icon: React.ReactNode;
  classes?: {
    root?: string;
    content?: string;
  };

  onClick?: () => void;
}

export const AccountPopupItem: FC<AccountPopupItemProps> = ({
  classes = {},
  icon,
  children,
  onClick,
}) => {
  return (
    <div
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyPress={onClick}
      className={cn(styles.root, classes.root)}
    >
      <div className={styles.icon}>{icon}</div>
      <div className={cn(styles.content, classes.content)}>{children}</div>
    </div>
  );
};
