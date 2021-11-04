import cn from 'classnames';

import { Badge } from 'components/badge/Badge';
import { Button } from 'components/button/Button';
import {
  MemberCardPopup,
  MemberCardPopupProps,
} from 'components/cards/member-card';
import { ImageWithFallback } from 'components/image-with-fallback';
import { useModal } from 'components/modal';
import { useAuthContext } from 'context/AuthContext';
import Link from 'next/link';
import React, { HTMLProps, useCallback } from 'react';

import { DAO } from 'types/dao';

import styles from './nav-dao.module.scss';

interface DaoItemProps extends Omit<HTMLProps<HTMLDivElement>, 'href'> {
  label: string;
  logo?: string;
  count?: number;
  active?: boolean;
  selected: boolean;
  className?: string;
  detailsClassName?: string;
  dao: DAO;
  onClick: () => void;
}

export const DaoItem: React.VFC<DaoItemProps> = ({
  label,
  count,
  className,
  logo,
  detailsClassName,
  dao,
  selected,
  onClick,
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
    isOpen: true,
    tokens: {
      value: 5,
      type: 'MEW',
      percent: 11.5,
    },
  });

  const onDetailsClick = useCallback(async () => {
    await showMemberCard({
      title: dao.id,
      votes: dao.votes,
    });
  }, [dao, showMemberCard]);

  const rootClassName = cn(styles.item, className, {
    [styles.selected]: selected,
  });

  return (
    <div {...props} tabIndex={0} role="button" className={rootClassName}>
      <Link passHref href={`/dao/${dao.id}`}>
        <a href="*" onClick={onClick} className={styles.name}>
          <ImageWithFallback
            fallbackSrc="/flag.svg"
            loading="eager"
            src={logo}
            width={24}
            height={24}
            alt={`${label} Dao Logo`}
          />

          {label}
          {Number.isFinite(count) && (
            <Badge className={styles.counter} variant="neonYellow" size="small">
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
