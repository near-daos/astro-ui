import React from 'react';
import cn from 'classnames';
import Link from 'next/link';

import { Icon } from 'components/Icon';

import styles from './logo.module.scss';

interface LogoProps {
  className?: string;
}

export const Logo: React.VFC<LogoProps> = ({ className, ...props }) => {
  return (
    <Link href="/" passHref>
      <a href="*" {...props} className={cn(styles.logo, className)}>
        <Icon width={48} height={48} name="flag" />
      </a>
    </Link>
  );
};
