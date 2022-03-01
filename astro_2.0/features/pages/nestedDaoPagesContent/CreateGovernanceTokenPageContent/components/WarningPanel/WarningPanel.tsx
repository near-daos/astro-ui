import React, { FC } from 'react';
import cn from 'classnames';
import { Icon } from 'components/Icon';

import styles from './WarningPanel.module.scss';

interface WarningPanelProps {
  className?: string;
}

export const WarningPanel: FC<WarningPanelProps> = ({ className }) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.iconWrapper}>
        <Icon name="stateAlert" className={styles.icon} />
      </div>
      <p className={styles.message}>
        The token is created once. You cannot change your choice after
        confirmation.
      </p>
    </div>
  );
};
