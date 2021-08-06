import React from 'react';
import { Icon } from 'components/Icon';
import Link from 'next/link';
import styles from './logo.module.scss';

// TODO This is placeholder logo component
export const Logo: React.VFC = ({ ...props }) => {
  return (
    <Link href="/" passHref>
      <a href="*" {...props} className={styles.logo}>
        <Icon width={48} height={48} name="flag" />
      </a>
    </Link>
  );
};
