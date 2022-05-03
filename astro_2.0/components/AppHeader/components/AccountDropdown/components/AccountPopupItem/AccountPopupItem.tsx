import cn from 'classnames';
import React, { FC } from 'react';

import styles from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/AccountPopupItem/AccountPopupItem.module.scss';

interface AccountPopupItemProps {
  className?: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  onClick?: () => void;
}

export const AccountPopupItem: FC<AccountPopupItemProps> = ({
  className,
  icon,
  content,
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
      <div className={styles.icon}>{icon}</div>
      <div className={styles.content}>{content}</div>
    </div>
  );
};
