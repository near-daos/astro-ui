import React from 'react';
import cn from 'classnames';
import { NavLink } from 'astro_2.0/components/NavLink';
import { Badge, getBadgeVariant } from 'components/Badge';
import { useTranslation } from 'next-i18next';

import styles from './GroupsList.module.scss';

type GroupsListProps = {
  className?: string;
  daoId: string;
  groups: string[];
};

export const GroupsList: React.FC<GroupsListProps> = ({
  className,
  groups,
  daoId,
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn(styles.root, className)}>
      <h5 className={styles.title}>{t('groups')}</h5>
      <ul className={styles.list}>
        {groups.map(group => (
          <li className={styles.item} key={group}>
            <NavLink
              className={styles.link}
              href={`/dao/${daoId}/groups/${group}`}
            >
              <Badge key={group} size="small" variant={getBadgeVariant(group)}>
                {group}
              </Badge>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
