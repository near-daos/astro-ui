import React, { FC, ReactNode } from 'react';

import { Icon } from 'components/Icon';

import styles from './DaoWarning.module.scss';

interface DaoWarningProps {
  content: ReactNode;
  control?: ReactNode;
  className?: string;
}

export const DaoWarning: FC<DaoWarningProps> = ({
  content,
  control,
  className,
}) => {
  return (
    <div className={className}>
      <div className={styles.root}>
        <div className={styles.status}>
          <Icon name="info" className={styles.icon} />
        </div>
        <div className={styles.content}>{content}</div>
        {control && <div className={styles.control}>{control}</div>}
      </div>
    </div>
  );
};
