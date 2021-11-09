import React from 'react';
import cn from 'classnames';
import NavLink from 'astro_2.0/components/NavLink';
import { Badge } from 'components/badge/Badge';

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
  return (
    <div className={cn(styles.root, className)}>
      <h5 className={styles.title}>Groups</h5>
      <ul className={styles.list}>
        {groups.map(group => (
          <li className={styles.item}>
            <NavLink
              className={styles.link}
              href={`/dao/${daoId}/groups/${group}`}
            >
              <Badge key={group} size="small" variant="turqoise">
                {group}
              </Badge>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
