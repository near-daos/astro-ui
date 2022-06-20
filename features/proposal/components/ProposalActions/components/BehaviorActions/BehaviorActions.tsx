import React, { FC, useState } from 'react';
import cn from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

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
}

export const BehaviorActions: FC<Props> = ({
  onRemove,
  onSelect,
  removed,
  disabled,
  allowSelect,
}) => {
  const { multiVoting } = useFlags();
  const [open, setOpen] = useState(false);

  return (
    <GenericDropdown
      isOpen={open}
      onOpenUpdate={setOpen}
      parent={
        <div className={styles.root}>
          <IconButton icon="buttonMore" className={styles.rootIcon} />
        </div>
      }
    >
      <ul className={styles.menu}>
        {multiVoting && (
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
            <span>Delete</span>
          </Button>
        </li>
      </ul>
    </GenericDropdown>
  );
};
