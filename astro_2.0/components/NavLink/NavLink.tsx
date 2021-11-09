import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cn from 'classnames';

export interface NavLinkProps {
  className?: string;
  href?: string;
  children: React.ReactNode;
  activeClassName?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
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

export default NavLink;
