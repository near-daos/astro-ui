import React, { FC, useState } from 'react';
import cn from 'classnames';

import { IconButton } from 'components/button/IconButton';
import { Icon } from 'components/Icon';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';
import { Button } from 'components/button/Button';

import styles from './BehaviorActions.module.scss';

interface Props {
  onRemove: React.MouseEventHandler<HTMLButtonElement>;
  onSelect: React.MouseEventHandler<HTMLButtonElement>;
  removeCount: number;
  removed: boolean;
  disabled: boolean;
  allowSelect?: boolean;
  hideSelect?: boolean;
  className?: string;
  iconClassName?: string;
}

export const BehaviorActions: FC<Props> = ({
  onRemove,
  onSelect,
  removed,
  disabled,
  allowSelect,
  hideSelect,
  className,
  iconClassName,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <GenericDropdown
      isOpen={open}
      onOpenUpdate={setOpen}
      parent={
        <div className={cn(styles.root, className)}>
          <IconButton
            icon="buttonMore"
            className={cn(styles.rootIcon, iconClassName)}
          />
        </div>
      }
    >
      <ul className={styles.menu}>
        {!hideSelect && (
          <li className={styles.menuItem}>
            <Button
              variant="transparent"
              className={cn(styles.buttonContent, {
                [styles.disabled]: !allowSelect,
              })}
              size="small"
              onClick={onSelect}
              disabled={!allowSelect}
            >
              <Icon name="multiselect" className={styles.icon} />{' '}
              <span>Select</span>
            </Button>
          </li>
        )}
        <li className={cn(styles.menuItem, styles.red)}>
          <Button
            variant="transparent"
            className={cn(styles.buttonContent, styles.red, {
              [styles.disabled]: removed || disabled,
            })}
            size="small"
            onClick={onRemove}
            disabled={removed || disabled}
          >
            <Icon name="buttonDelete" className={styles.icon} />{' '}
            <span>Remove</span>
          </Button>
        </li>
      </ul>
    </GenericDropdown>
  );
};
