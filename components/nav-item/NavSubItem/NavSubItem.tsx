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
  href?: string;
  urlParams?: string | null | ParsedUrlQueryInput | undefined;
  count?: number;
  subHrefs?: string[];
  active?: boolean;
  className?: string;
  detailsHref?: string | UrlObject;
  detailsClassName?: string;
  disabled?: boolean;
  as?: string;
};

export const NavSubItem: React.VFC<DAONameProps> = ({
  label,
  count,
  className,
  href,
  urlParams,
  subHrefs,
  disabled,
  as
}) => {
  const isActive = useIsActive(href, subHrefs);

  const rootClassName = cn(styles.sub, className, {
    [styles.active]: isActive,
    [styles.disabled]: disabled
  });

  const content = (
    <>
      {label}
      {Number.isFinite(count) && (
        <span className={styles.badge}>
          {count && count > 99 ? '99+' : count}
        </span>
      )}
    </>
  );

  if (!href) {
    return (
      <div>
        <div className={rootClassName}>{content}</div>
      </div>
    );
  }

  return (
    <div>
      <Link passHref href={{ pathname: href, query: urlParams }} as={as}>
        {/* TODO Property 'href' would be overridden by Link. Check https://git.io/Jns2B */}
        <a href="*" className={rootClassName}>
          {content}
        </a>
      </Link>
    </div>
  );
};
