import React, { CSSProperties, FC } from 'react';
import cn from 'classnames';
import { Button } from 'components/button/Button';

import styles from './StatCard.module.scss';

interface StatCardProps {
  onClick?: () => void;
  className?: string;
  selected: boolean;
  disabled?: boolean;
  style?: CSSProperties;
}

export const StatCard: FC<StatCardProps> = ({
  selected,
  onClick,
  children,
  className,
  disabled,
  style,
}) => {
  return (
    <Button
      data-testid="stat-card"
      size="block"
      onClick={onClick}
      variant="transparent"
      disabled={disabled}
      className={cn(styles.root, className, {
        [styles.clickable]: !!onClick,
        [styles.selected]: selected,
      })}
      style={style}
    >
      {children}
    </Button>
  );
};

export default StatCard;
