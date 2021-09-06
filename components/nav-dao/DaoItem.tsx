import { UrlObject } from 'url';
import React, { HTMLProps, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import { Badge } from 'components/badge/Badge';
import { Button } from 'components/button/Button';
import { useModal } from 'components/modal';
import {
  MemberCardPopup,
  MemberCardPopupProps
} from 'components/cards/member-card';
import styles from './nav-dao.module.scss';

interface DaoItemProps extends Omit<HTMLProps<HTMLDivElement>, 'href'> {
  label: string;
  href: string | UrlObject;
  logo: string;
  count?: number;
  active?: boolean;
  className?: string;
  detailsClassName?: string;
}

export const DaoItem: React.VFC<DaoItemProps> = ({
  label,
  count,
  className,
  logo,
  href,
  detailsClassName,
  ...props
}) => {
  const [showMemberCard] = useModal<MemberCardPopupProps>(MemberCardPopup, {
    title: 'jonasteam.near',
    children: (
      <>
        <Badge size="small" variant="green">
          Atos
        </Badge>
        <Badge size="large" variant="orange">
          Portos
        </Badge>
        <Badge size="medium">Aramis</Badge>
        <Badge size="medium" variant="turqoise">
          d&apos;Artagnan
        </Badge>
      </>
    ),
    votes: 23,
    isOpen: true,
    tokens: {
      value: 5,
      type: 'MEW',
      percent: 11.5
    }
  });

  const onDetailsClick = useCallback(async () => {
    await showMemberCard();
  }, [showMemberCard]);

  return (
    <div {...props} className={cn(styles.item, className)}>
      <Link passHref href={href}>
        <a className={styles.name}>
          <Image src={logo} width={24} height={24} alt={`${label} Dao Logo`} />

          {label}
          {Number.isFinite(count) && (
            <Badge className={styles.counter} variant="primary" size="small">
              {count && count > 99 ? '99+' : count}
            </Badge>
          )}
        </a>
      </Link>
      <Button
        variant="tertiary"
        size="small"
        onClick={onDetailsClick}
        className={cn(styles.details, detailsClassName)}
      >
        Details
      </Button>
    </div>
  );
};
