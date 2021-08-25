import React, { FC } from 'react';

import styles from './groups-tab-view.module.scss';

export interface GroupsTabViewProps {
  viewMode?: boolean;
}

export const GroupsTabView: FC<GroupsTabViewProps> = ({ viewMode = true }) => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>Placeholder {viewMode}</div>
    </div>
  );
};
