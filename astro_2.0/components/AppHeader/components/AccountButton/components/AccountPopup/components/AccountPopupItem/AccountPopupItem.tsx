import cn from 'classnames';
import Link from 'next/link';
import React, { FC } from 'react';

import { useIsHrefActive } from 'hooks/useIsHrefActive';

import styles from './AccountPopupItem.module.scss';

interface AccountPopupItemProps {
  href?: string;
  className?: string;
  onClick?: () => void;
}

export const AccountPopupItem: FC<AccountPopupItemProps> = ({
  href,
  className,
  children,
  onClick,
}) => {
  const isActive = useIsHrefActive(href);

  const content = (
    <div
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyPress={onClick}
      className={cn(styles.root, className, {
        [styles.active]: isActive,
      })}
    >
      {children}
    </div>
  );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
};
