import React, { FC } from 'react';
import cn from 'classnames';

import styles from './StatCard.module.scss';

interface StatCardProps {
  onClick?: () => void;
  className?: string;
}

export const StatCard: FC<StatCardProps> = ({
  onClick,
  children,
  className,
}) => {
  return (
    <div
      className={cn(styles.root, className, { [styles.clickable]: !!onClick })}
    >
      {children}
    </div>
  );
};

export default StatCard;
