import cn from 'classnames';
import Link from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';
import React, { FC, HTMLAttributes, ReactNode } from 'react';

import { Badge } from 'components/badge/Badge';
import { Icon, IconName } from 'components/Icon';

// eslint-disable-next-line no-restricted-imports
import { useIsActive } from '../navHooks';

import styles from './NavItem.module.scss';

interface NavItemProps extends HTMLAttributes<HTMLAnchorElement> {
  label: string | ReactNode;
  href?: string;
  urlParams?: string | null | ParsedUrlQueryInput | undefined;
  icon: IconName;
  count?: number;
  active?: boolean;
  className?: string;
  topDelimiter?: boolean;
  bottomDelimiter?: boolean;
  subHrefs?: string[];
  onClick?: () => void;
}

export const NavItem: FC<NavItemProps> = ({
  label,
  icon,
  href,
  urlParams,
  count,
  active,
  className,
  topDelimiter,
  bottomDelimiter,
  subHrefs = [],
  onClick,
  children
}) => {
  const isActive = useIsActive(href, subHrefs);

  const rootClassName = cn(styles.nav, className, {
    [styles.active]: active || isActive,
    [styles.topDelimiter]: topDelimiter,
    [styles.bottomDelimiter]: bottomDelimiter
  });

  function handleOnClick() {
    onClick?.();
  }

  const renderContent = () => (
    <>
      <Icon height={16} name={icon} className={styles.icon} />
      <span className={styles.label}> {label} </span>
      {Number.isFinite(count) && (
        <Badge className={styles.badge} variant="primary" size="small">
          {count && count > 99 ? '99+' : count}
        </Badge>
      )}
    </>
  );

  function renderChildren() {
    if (isActive) {
      return children;
    }

    return null;
  }

  return (
    <>
      <Link href={{ pathname: href, query: urlParams }} passHref>
        <a
          href="*"
          onClick={handleOnClick}
          onKeyPress={handleOnClick}
          className={rootClassName}
        >
          {renderContent()}
        </a>
      </Link>
      {renderChildren()}
    </>
  );
};

NavItem.defaultProps = {
  href: '',
  count: undefined,
  active: false,
  className: '',
  topDelimiter: false,
  bottomDelimiter: false,
  onClick: undefined
} as Partial<NavItemProps>;
