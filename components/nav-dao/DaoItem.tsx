import { UrlObject } from 'url';
import React, { HTMLProps } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import { Badge } from 'components/badge/Badge';
import styles from './nav-dao.module.scss';

interface DaoItemProps extends Omit<HTMLProps<HTMLDivElement>, 'href'> {
  label: string;
  href: string | UrlObject;
  logo: string;
  count?: number;
  active?: boolean;
  className?: string;
  showDetails?: boolean;
  detailsHref?: string | UrlObject;
  detailsClassName?: string;
}

export const DaoItem: React.VFC<DaoItemProps> = ({
  label,
  count,
  className,
  logo,
  href,
  showDetails,
  detailsHref,
  detailsClassName,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(styles.item, className)}
      style={{ paddingBottom: showDetails && detailsHref ? 0 : '12px' }}
    >
      <Link passHref href={href}>
        {/* TODO Property 'href' would be overridden by Link. Check https://git.io/Jns2B */}
        <a href="*" className={styles.name}>
          <Image
            src={logo}
            width={24}
            height={24}
            alt={`${label} Dao Logo`}
            placeholder="blur"
            blurDataURL="/flag.svg"
          />

          {label}
          {Number.isFinite(count) && (
            <Badge className={styles.counter} variant="primary" size="small">
              {count && count > 99 ? '99+' : count}
            </Badge>
          )}
        </a>
      </Link>
      {showDetails && detailsHref && (
        <Link passHref href={detailsHref}>
          {/* TODO Property 'href' would be overridden by Link. Check https://git.io/Jns2B */}
          <a href="*" className={cn(styles.details, detailsClassName)}>
            Details
          </a>
        </Link>
      )}
    </div>
  );
};
