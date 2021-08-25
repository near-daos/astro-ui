import React, { HTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import { Icon, IconName } from 'components/Icon';
import { Badge } from 'components/badge/Badge';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { UrlObject } from 'url';
import styles from './nav-item.module.scss';

interface NavItemProps extends HTMLAttributes<HTMLAnchorElement> {
  label: string | ReactNode;
  href: string | UrlObject;
  icon: IconName;
  count?: number;
  active?: boolean;
  className?: string;
}

export const NavItem: React.FC<NavItemProps> = ({
  label,
  icon,
  href,
  count,
  active: isActive,
  className,
  ...props
}) => {
  const router = useRouter();

  return (
    <Link href={href} passHref>
      {/* TODO Property 'href' would be overridden by Link. Check https://git.io/Jns2B */}
      <a
        {...props}
        href="*"
        className={cn(
          styles.nav,
          {
            [styles.active]: isActive || router.pathname === href
          },
          className
        )}
      >
        <Icon height={16} name={icon} />
        <span> {label} </span>
        {Number.isFinite(count) && (
          <Badge className={styles.badge} variant="primary" size="small">
            {count && count > 99 ? '99+' : count}
          </Badge>
        )}
      </a>
    </Link>
  );
};
