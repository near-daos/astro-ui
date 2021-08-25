import React, { FC } from 'react';

import styles from './governance-tab-view.module.scss';

export interface GovernanceTabViewProps {
  viewMode?: boolean;
}

export const GovernanceTabView: FC<GovernanceTabViewProps> = ({
  viewMode = true
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>Placeholder {viewMode}</div>
    </div>
  );
};
