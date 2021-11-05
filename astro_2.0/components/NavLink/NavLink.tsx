import React from 'react';
import Link from 'next/link';

export interface NavLinkProps {
  className?: string;
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ className, href, children }) => {
  return (
    <Link passHref href={href}>
      <a href="*" className={className}>
        {children}
      </a>
    </Link>
  );
};

export default NavLink;
