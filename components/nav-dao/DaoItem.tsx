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

import { DAO } from 'types/dao';
import { useAuthContext } from 'context/AuthContext';

import styles from './nav-dao.module.scss';

interface DaoItemProps extends Omit<HTMLProps<HTMLDivElement>, 'href'> {
  label: string;
  href: string | UrlObject;
  logo: string;
  count?: number;
  active?: boolean;
  className?: string;
  detailsClassName?: string;
  dao: DAO;
  selectDao: (dao: DAO) => void;
}

export const DaoItem: React.VFC<DaoItemProps> = ({
  label,
  count,
  className,
  logo,
  href,
  detailsClassName,
  dao,
  selectDao,
  ...props
}) => {
  const { accountId } = useAuthContext();
  const [showMemberCard] = useModal<MemberCardPopupProps>(MemberCardPopup, {
    title: accountId,
    children: (
      <>
        {dao.groups
          .filter(item => item.members?.includes(accountId))
          .map(item => (
            <Badge size="small" variant="green" key={item.name}>
              {item.name}
            </Badge>
          ))}
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

  function handleItemClick() {
    selectDao(dao);
  }

  return (
    <div
      {...props}
      tabIndex={0}
      role="button"
      onClick={handleItemClick}
      onKeyPress={handleItemClick}
      className={cn(styles.item, className)}
    >
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
