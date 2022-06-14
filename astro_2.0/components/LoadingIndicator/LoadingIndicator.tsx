import React, { FC } from 'react';
import cn from 'classnames';
import { Icon } from 'components/Icon';

import styles from './LoadingIndicator.module.scss';

interface LoadingIndicatorProps {
  className?: string;
  label?: string;
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({
  className,
  label,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <Icon name="loading" className={styles.icon} width={24} />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
};
