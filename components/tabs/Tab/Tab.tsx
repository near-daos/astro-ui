import cn from 'classnames';
import React, { FC, forwardRef, RefObject, useCallback } from 'react';

import { handleEnterKeyPress } from 'components/tabs/helpers';
import { TabItem } from 'components/tabs/types';

import styles from './tab.module.scss';

interface TabProps {
  tab: TabItem;
  active?: boolean;
  onClick: (tab: TabItem) => void;
}

export const Tab: FC<TabProps> = forwardRef((props, ref) => {
  const { tab, active, onClick } = props;

  const { label } = tab;

  const handleClick = useCallback(() => {
    onClick(tab);
  }, [onClick, tab]);

  const className = cn(styles.tab, 'body3', {
    [styles.active]: active
  });

  const rootRef = ref as RefObject<HTMLDivElement>;

  return (
    <div
      tabIndex={0}
      data-name={label}
      role="button"
      ref={rootRef}
      onClick={handleClick}
      className={className}
      onKeyPress={handleEnterKeyPress(handleClick)}
    >
      {label}
    </div>
  );
});
