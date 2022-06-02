import React, { FC } from 'react';
import cn from 'classnames';

import { Icon, IconName } from 'components/Icon';

import styles from './DraftInfoItem.module.scss';

interface DraftInfoItemProps {
  className?: string;
  count: number;
  iconName: IconName;
}

export const DraftInfoItem: FC<DraftInfoItemProps> = ({
  className,
  count,
  iconName,
}) => {
  return (
    <div className={cn(styles.draftInfoItem, className)}>
      <div className={styles.count}>{count}</div>
      <Icon name={iconName} className={styles.icon} />
    </div>
  );
};
