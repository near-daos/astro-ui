import React from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UrlObject } from 'url';

export interface NavLinkProps {
  className?: string;
  href?: string | UrlObject;
  children: React.ReactNode;
  activeClassName?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({
  className,
  activeClassName = '',
  href,
  children,
}) => {
  const { asPath } = useRouter();

  const content = (
    <a className={cn(className, { [activeClassName]: asPath === href })}>
      {children}
    </a>
  );

  return href ? (
    <Link passHref href={href}>
      {content}
    </Link>
  ) : (
    content
  );
};
