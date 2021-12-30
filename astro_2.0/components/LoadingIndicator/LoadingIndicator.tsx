import React, { FC } from 'react';
import cn from 'classnames';
import { Icon } from 'components/Icon';

import styles from './LoadingIndicator.module.scss';

interface LoadingIndicatorProps {
  className?: string;
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ className }) => {
  return (
    <div className={cn(styles.root, className)}>
      <Icon name="loading" className={styles.icon} />
    </div>
  );
};
