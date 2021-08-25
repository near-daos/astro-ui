import React, { FC } from 'react';

import styles from './treasury-tab-view.module.scss';

export interface TreasuryTabViewProps {
  viewMode?: boolean;
}

export const TreasuryTabView: FC<TreasuryTabViewProps> = ({
  viewMode = true
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>Placeholder {viewMode}</div>
    </div>
  );
};
