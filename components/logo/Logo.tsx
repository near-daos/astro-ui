import { useRouter } from 'next/router';
import React from 'react';
import cn from 'classnames';
import Link from 'next/link';
import Image from 'next/image';

import { Icon } from 'components/Icon';

import styles from './logo.module.scss';

interface LogoProps {
  className?: string;
  src?: string;
}

export const Logo: React.VFC<LogoProps> = ({ className, src, ...props }) => {
  const router = useRouter();

  return (
    <Link href={{ href: '/dao/[dao]', query: router.query }} passHref>
      <a href="*" {...props} className={cn(styles.logo, className)}>
        {src ? (
          <Image src={src} width={48} height={48} />
        ) : (
          <Icon width={48} height={48} name="flag" />
        )}
      </a>
    </Link>
  );
};
