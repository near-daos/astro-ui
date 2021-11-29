import React from 'react';
import cn from 'classnames';
import Link from 'next/link';

import { Icon } from 'components/Icon';

import styles from './logo.module.scss';

interface LogoProps {
  className?: string;
}

export const Logo: React.VFC<LogoProps> = ({ className }) => {
  return (
    <Link href="https://astrodao.com/" passHref>
      <a className={cn(styles.logo, className)}>
        <Icon width={120} name="appLogo" />
      </a>
    </Link>
  );
};
