import React, { FC } from 'react';
import cn from 'classnames';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

import styles from './ViewToggle.module.scss';

export type ViewToggleOption = 'list' | 'timeline' | 'feed';

interface ViewToggleProps {
  selected: ViewToggleOption;
  onSelect: (val: ViewToggleOption) => void;
  className?: string;
}

export const ViewToggle: FC<ViewToggleProps> = ({
  selected,
  onSelect,
  className,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <Button
        size="small"
        variant="tertiary"
        onClick={() => onSelect('feed')}
        className={cn(styles.buttonWrapper, styles.first)}
      >
        <Icon
          name="feed"
          className={cn(styles.button, {
            [styles.active]: selected === 'feed',
          })}
        />
      </Button>
      <Button
        size="small"
        variant="tertiary"
        onClick={() => onSelect('list')}
        className={cn(styles.buttonWrapper)}
      >
        <Icon
          name="list"
          className={cn(styles.button, {
            [styles.active]: selected === 'list',
          })}
        />
      </Button>
      <Button
        size="small"
        onClick={() => onSelect('timeline')}
        variant="tertiary"
        className={styles.buttonWrapper}
      >
        <Icon
          name="timeline"
          className={cn(styles.button, {
            [styles.active]: selected === 'timeline',
          })}
        />
      </Button>
    </div>
  );
};
