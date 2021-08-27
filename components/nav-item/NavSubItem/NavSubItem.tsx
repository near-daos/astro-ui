import cn from 'classnames';
import Link from 'next/link';
import { UrlObject } from 'url';
import React, { ReactNode } from 'react';

// eslint-disable-next-line no-restricted-imports
import { useIsActive } from '../navHooks';

import styles from './NavSubItem.module.scss';

type DAONameProps = {
  label: string | ReactNode;
  href: string;
  count?: number;
  subHrefs?: string[];
  active?: boolean;
  className?: string;
  detailsHref?: string | UrlObject;
  detailsClassName?: string;
};

export const NavSubItem: React.VFC<DAONameProps> = ({
  label,
  count,
  className,
  href,
  subHrefs
}) => {
  const isActive = useIsActive(href, subHrefs);

  const rootClassName = cn(styles.sub, className, {
    [styles.active]: isActive
  });

  return (
    <div>
      <Link passHref href={href}>
        {/* TODO Property 'href' would be overridden by Link. Check https://git.io/Jns2B */}
        <a href="*" className={rootClassName}>
          {label}
          {Number.isFinite(count) && (
            <span className={styles.badge}>
              {count && count > 99 ? '99+' : count}
            </span>
          )}
        </a>
      </Link>
    </div>
  );
};
