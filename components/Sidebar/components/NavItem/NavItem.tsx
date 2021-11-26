import cn from 'classnames';
import Link from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';
import React, { FC, HTMLAttributes, ReactNode } from 'react';

import { Badge } from 'components/badge/Badge';
import { Icon, IconName } from 'components/Icon';

import { useIsHrefActive } from 'hooks/useIsHrefActive';

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
  children,
}) => {
  const isActive = useIsHrefActive(href, subHrefs);

  function handleOnClick() {
    onClick?.();
  }

  function renderContent() {
    const rootClassName = cn(styles.nav, className, {
      [styles.active]: active || isActive,
      [styles.topDelimiter]: topDelimiter,
      [styles.bottomDelimiter]: bottomDelimiter,
      [styles.nonClickable]: !href && !onClick,
    });

    const props = {
      onClick: handleOnClick,
      onKeyPress: handleOnClick,
      className: rootClassName,
    };

    const content = (
      <>
        <Icon height={24} name={icon} className={styles.icon} />
        <span className={styles.label}> {label} </span>
        {Number.isFinite(count) && (
          <Badge className={styles.badge} variant="primary" size="small">
            {count && count > 99 ? '99+' : count}
          </Badge>
        )}
      </>
    );

    if (href) {
      return (
        <Link href={{ pathname: href, query: urlParams }} passHref>
          <a href="*" {...props}>
            {content}
          </a>
        </Link>
      );
    }

    return <div {...props}>{content}</div>;
  }

  function renderChildren() {
    if (isActive) {
      return children;
    }

    return null;
  }

  return (
    <>
      {renderContent()}
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
  onClick: undefined,
} as Partial<NavItemProps>;
