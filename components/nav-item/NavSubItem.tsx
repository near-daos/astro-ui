import { UrlObject } from 'url';
import React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import styles from './nav-item.module.scss';

type DAONameProps = {
  label: string;
  href: string | UrlObject;
  count?: number;
  active?: boolean;
  className?: string;
  detailsHref?: string | UrlObject;
  detailsClassName?: string;
};

export const NavSubItem: React.VFC<DAONameProps> = ({
  label,
  count,
  className,
  href
}) => {
  return (
    <div className={styles.nav}>
      <Link passHref href={href}>
        {/* TODO Property 'href' would be overridden by Link. Check https://git.io/Jns2B */}
        <a href="*" className={cn(styles.sub, className)}>
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
