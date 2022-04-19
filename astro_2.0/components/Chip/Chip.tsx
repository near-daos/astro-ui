import React, { FC, useCallback } from 'react';
import cn from 'classnames';

import { IconButton } from 'components/button/IconButton';

import styles from './Chip.module.scss';

export interface ChipProps {
  className?: string;
  name: string;
  onRemove: (name: string) => void;
}

export const Chip: FC<ChipProps> = ({ className, onRemove, name }) => {
  const remove = useCallback(() => {
    onRemove(name);
  }, [name, onRemove]);

  return (
    <div className={cn(styles.chip, className)}>
      <div className={styles.name}>{name}</div>
      <IconButton className={styles.iconButton} onClick={remove} icon="close" />
    </div>
  );
};
