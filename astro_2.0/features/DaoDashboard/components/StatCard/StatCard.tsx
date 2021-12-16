import React, { FC } from 'react';
import cn from 'classnames';
import { Button } from 'components/button/Button';

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
    <Button
      onClick={onClick}
      variant="transparent"
      className={cn(styles.root, className, { [styles.clickable]: !!onClick })}
    >
      {children}
    </Button>
  );
};

export default StatCard;
