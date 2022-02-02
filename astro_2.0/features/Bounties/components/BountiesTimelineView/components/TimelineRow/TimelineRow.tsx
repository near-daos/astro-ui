import React, { ReactNode } from 'react';

import styles from './TimelineRow.module.scss';

interface TimelineRowProps {
  comingSoonCell: ReactNode;
  availableCell: ReactNode;
  inProgressCell: ReactNode;
}

export const TimelineRow: React.FC<TimelineRowProps> = ({
  comingSoonCell,
  availableCell,
  inProgressCell,
}) => {
  return (
    <div className={styles.row}>
      <div className={styles.comingSoon}>{comingSoonCell}</div>
      <div className={styles.separator} />
      <div className={styles.available}>{availableCell}</div>
      <div className={styles.separator} />
      <div className={styles.inProgress}>{inProgressCell}</div>
    </div>
  );
};
