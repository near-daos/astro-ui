import cn from 'classnames';
import Link from 'next/link';
import React, { FC } from 'react';

import { useIsHrefActive } from 'hooks/useIsHrefActive';

import { Icon } from 'components/Icon';

import styles from './NavButton.module.scss';

interface NavButtonProps {
  href: string;
}

export const NavButton: FC<NavButtonProps> = ({ href, children }) => {
  const isActive = useIsHrefActive(href);

  const rootClassName = cn(styles.root, {
    [styles.active]: isActive,
  });

  return (
    <Link href={href} passHref>
      <div className={rootClassName}>
        <div className={styles.description}>
          <Icon height={16} name="stateCommunities" className={styles.icon} />
          <div>{children}</div>
        </div>
        <div className={styles.underline} />
      </div>
    </Link>
  );
};
