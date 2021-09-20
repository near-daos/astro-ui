import React from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Icon } from 'components/Icon';

import styles from './logo.module.scss';

interface LogoProps {
  className?: string;
}

export const Logo: React.VFC<LogoProps> = ({ className, ...props }) => {
  const router = useRouter();

  return (
    <Link href={{ href: '/dao/[dao]', query: router.query }} passHref>
      <a href="*" {...props} className={cn(styles.logo, className)}>
        <Icon width={92} name="appLogo" />
      </a>
    </Link>
  );
};
