import React, { FC } from 'react';
import cn from 'classnames';

import { Icon, IconName } from 'components/Icon';

import styles from './DraftInfoItem.module.scss';

interface DraftInfoItemProps {
  className?: string;
  count: number;
  iconName: IconName;
  onClick?: () => void;
}

export const DraftInfoItem: FC<DraftInfoItemProps> = ({
  className,
  count,
  iconName,
  onClick,
}) => {
  const icon = <Icon name={iconName} className={styles.icon} />;

  const renderIcon = () => {
    if (onClick) {
      return (
        <button className={styles.button} type="button" onClick={onClick}>
          {icon}
        </button>
      );
    }

    return icon;
  };

  return (
    <div className={cn(styles.draftInfoItem, className)}>
      <div className={styles.count}>{count}</div>
      {renderIcon()}
    </div>
  );
};
