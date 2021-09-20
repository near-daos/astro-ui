import cn from 'classnames';
import Link from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';
import { UrlObject } from 'url';
import React, { ReactNode } from 'react';

// eslint-disable-next-line no-restricted-imports
import { useIsActive } from '../navHooks';

import styles from './NavSubItem.module.scss';

type DAONameProps = {
  label: string | ReactNode;
  href: string;
  urlParams?: string | null | ParsedUrlQueryInput | undefined;
  count?: number;
  subHrefs?: string[];
  active?: boolean;
  className?: string;
  detailsHref?: string | UrlObject;
  detailsClassName?: string;
  disabled?: boolean;
};

export const NavSubItem: React.VFC<DAONameProps> = ({
  label,
  count,
  className,
  href,
  urlParams,
  subHrefs,
  disabled
}) => {
  const isActive = useIsActive(href, subHrefs);

  const rootClassName = cn(styles.sub, className, {
    [styles.active]: isActive,
    [styles.disabled]: disabled
  });

  const disabledAttributes = disabled
    ? { tabIndex: -1, 'aria-disabled': true }
    : {};

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (disabled) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <Link passHref href={{ pathname: href, query: urlParams }}>
        {/* TODO Property 'href' would be overridden by Link. Check https://git.io/Jns2B */}
        <a
          href="*"
          className={rootClassName}
          {...disabledAttributes}
          onClick={handleClick}
        >
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
