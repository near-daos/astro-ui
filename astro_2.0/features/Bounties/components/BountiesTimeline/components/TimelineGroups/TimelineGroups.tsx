import React, { FC } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';
import { TimelineGroup } from 'astro_2.0/features/Bounties/components/BountiesTimeline/types';

import styles from 'astro_2.0/features/Bounties/components/BountiesTimeline/BountiesTimeline.module.scss';

interface TimelineGroupsProps {
  dataset: TimelineGroup[];
  toggleGroup: (id: string) => void;
}

export const TimelineGroups: FC<TimelineGroupsProps> = ({
  dataset,
  toggleGroup,
}) => {
  return (
    <div className={styles.groups}>
      <div className={styles.groupsHeader}>Name</div>
      {dataset.map(group => {
        return (
          <React.Fragment key={group.id}>
            <div
              tabIndex={0}
              className={styles.group}
              role="button"
              onKeyPress={() => toggleGroup(group.id)}
              onClick={() => toggleGroup(group.id)}
            >
              <div>
                <Icon
                  className={styles.groupIcon}
                  name={group.isOpen ? 'buttonArrowUp' : 'buttonArrowDown'}
                />
              </div>
              <div className={styles.groupName}>{group.name}</div>
            </div>
            {group.isOpen &&
              group.claims.length > 0 &&
              group.claims.map(claim => (
                <div key={claim.id} className={styles.group}>
                  <div className={cn(styles.groupName, styles.claimName)}>
                    {claim.title}
                  </div>
                </div>
              ))}
          </React.Fragment>
        );
      })}
    </div>
  );
};
