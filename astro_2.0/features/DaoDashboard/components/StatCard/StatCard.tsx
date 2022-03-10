import React, { FC } from 'react';
import cn from 'classnames';
import { Button } from 'components/button/Button';

import styles from './StatCard.module.scss';

interface StatCardProps {
  onClick?: () => void;
  className?: string;
  selected: boolean;
  disabled?: boolean;
}

export const StatCard: FC<StatCardProps> = ({
  selected,
  onClick,
  children,
  className,
  disabled,
}) => {
  return (
    <Button
      onClick={onClick}
      variant="transparent"
      disabled={disabled}
      className={cn(styles.root, className, {
        [styles.clickable]: !!onClick,
        [styles.selected]: selected,
      })}
    >
      {children}
    </Button>
  );
};

export default StatCard;
