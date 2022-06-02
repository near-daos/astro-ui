import React, { FC } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { UrlObject } from 'url';

import { Icon } from 'components/Icon';

import styles from './BackButton.module.scss';

export interface BackButtonProps {
  className?: string;
  name: string;
  href: string | UrlObject;
}

export const BackButton: FC<BackButtonProps> = ({ className, href, name }) => {
  return (
    <Link href={href}>
      <a href="*" className={cn(styles.backButton, className)}>
        <Icon name="backLink" className={styles.icon} />
        <span>{name}</span>
      </a>
    </Link>
  );
};
