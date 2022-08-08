import React, { FC } from 'react';
import cn from 'classnames';

import { Icon, IconName } from 'components/Icon';
import { Button } from 'components/button/Button';

import styles from './SidebarActionItem.module.scss';

interface Props {
  icon: IconName;
  label: string;
  onClick: () => void;
}

export const SidebarActionItem: FC<Props> = ({ icon, label, onClick }) => {
  return (
    <Button
      variant="transparent"
      size="block"
      className={cn(styles.root)}
      onClick={onClick}
    >
      <div
        className={cn(styles.iconWrapper)}
        data-tip={label}
        data-place="right"
        data-offset="{ 'right': 10 }"
        data-delay-show="700"
      >
        <Icon name={icon} className={cn(styles.icon)} />
      </div>
      <div className={styles.label} data-expanded="hidden" data-value={label} />
    </Button>
  );
};
